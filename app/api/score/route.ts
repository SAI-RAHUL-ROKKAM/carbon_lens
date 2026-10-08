import { NextRequest } from "next/server";

/* ------------------------------------------------------------------ */
/*  Simple in-memory rate limiter (IP-based, 10 requests per minute)   */
/* ------------------------------------------------------------------ */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  // Drop entries older than the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

/* ------------------------------------------------------------------ */
/*  POST /api/score                                                    */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  /* --- Rate limiting --- */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 }
    );
  }

  /* --- Require a real API key --- */
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    console.error(
      "GEMINI_API_KEY is not set. Add it to .env.local to enable AI scoring."
    );
    return Response.json(
      {
        overallScore: 50,
        additionality: 50,
        permanence: 50,
        leakage: 50,
        communityImpact: 50,
        redFlags: [
          {
            text: "AI scoring unavailable — GEMINI_API_KEY is not configured",
            severity: "HIGH" as const,
          },
        ],
        summary:
          "Live AI analysis is unavailable because the server has no Gemini API key configured. These are placeholder scores and should not be trusted.",
        isDefault: true,
      },
      { status: 503 }
    );
  }

  try {
    const { projectName, projectType, country, methodology, creditsIssued } =
      await request.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert carbon credit auditor. Analyze this carbon offset project and return ONLY a valid JSON object with no additional text, markdown, or explanation.

Project details:
Name: ${projectName}
Type: ${projectType}
Country: ${country}
Methodology: ${methodology || "Not specified"}
Credits Issued: ${creditsIssued} tonnes CO₂

Return this exact JSON structure:
{
  "overallScore": <integer 0-100>,
  "additionality": <integer 0-100>,
  "permanence": <integer 0-100>,
  "leakage": <integer 0-100>,
  "communityImpact": <integer 0-100>,
  "redFlags": [
    {"text": "<flag description>", "severity": "HIGH" | "MEDIUM"},
    {"text": "<flag description>", "severity": "HIGH" | "MEDIUM"},
    {"text": "<flag description>", "severity": "HIGH" | "MEDIUM"}
  ],
  "summary": "<2 sentence plain English summary of main concerns>"
}

Base scores on known patterns:
- High credit volumes relative to project size = lower additionality
- REDD+ projects in weak governance countries = lower permanence
- Renewable energy in growing grid markets = lower additionality
- Projects with community displacement reports = lower communityImpact`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error(
        "Gemini API error:",
        JSON.stringify(data.error || data, null, 2)
      );
      return Response.json(
        {
          error: "Gemini API returned an error. Scores are unavailable.",
          overallScore: 50,
          additionality: 50,
          permanence: 50,
          leakage: 50,
          communityImpact: 50,
          redFlags: [
            {
              text: "AI analysis failed — scores are estimated defaults",
              severity: "HIGH" as const,
            },
          ],
          summary:
            "The Gemini API returned an error. These are placeholder scores and should not be trusted.",
          isDefault: true,
        },
        { status: 502 }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Safely parse JSON — strip any markdown fences if present
    const clean = text.replace(/```json|```/g, "").trim();

    let scores;
    try {
      scores = JSON.parse(clean);

      // Clamp all numeric values
      scores = {
        overallScore: clamp(scores.overallScore ?? 50, 0, 100),
        additionality: clamp(scores.additionality ?? 50, 0, 100),
        permanence: clamp(scores.permanence ?? 50, 0, 100),
        leakage: clamp(scores.leakage ?? 50, 0, 100),
        communityImpact: clamp(scores.communityImpact ?? 50, 0, 100),
        redFlags: Array.isArray(scores.redFlags)
          ? scores.redFlags
              .slice(0, 3)
              .map((f: { text?: string; severity?: string }) => ({
                text: f.text || "Unknown risk detected",
                severity: f.severity === "HIGH" ? "HIGH" : "MEDIUM",
              }))
          : [],
        summary:
          scores.summary || "Analysis could not generate a detailed summary.",
        isDefault: false,
      };
    } catch {
      // Gemini returned something unparseable — fail visibly
      console.error("Failed to parse Gemini response:", clean.substring(0, 200));
      return Response.json(
        {
          error: "Failed to parse AI response.",
          overallScore: 50,
          additionality: 50,
          permanence: 50,
          leakage: 50,
          communityImpact: 50,
          redFlags: [
            {
              text: "AI response was unparseable — scores are estimated defaults",
              severity: "HIGH" as const,
            },
          ],
          summary:
            "The AI returned an unparseable response. These are placeholder scores and should not be trusted.",
          isDefault: true,
        },
        { status: 502 }
      );
    }

    return Response.json(scores);
  } catch (error) {
    console.error("Score API error:", error);
    return Response.json(
      {
        error: "Internal server error during scoring.",
        overallScore: 50,
        additionality: 50,
        permanence: 50,
        leakage: 50,
        communityImpact: 50,
        redFlags: [
          {
            text: "Scoring service error — scores are estimated defaults",
            severity: "HIGH" as const,
          },
        ],
        summary:
          "An internal error occurred. These are placeholder scores and should not be trusted.",
        isDefault: true,
      },
      { status: 500 }
    );
  }
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(val)));
}
