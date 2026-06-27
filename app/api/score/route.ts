import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";

  console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

  try {
    const { projectName, projectType, country, methodology, creditsIssued } =
      await request.json();

    console.log("Project being scored:", projectName);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
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
- Projects with community displacement reports = lower communityImpact`
            }]
          }]
        }),
      }
    );

    const data = await response.json();
    
    console.log("Gemini response status:", response.status);
    if (!response.ok || data.error) {
      console.error("Gemini API error:", JSON.stringify(data.error || data, null, 2));
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Gemini raw response:", text.substring(0, 200));

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
          ? scores.redFlags.slice(0, 3).map((f: { text?: string; severity?: string }) => ({
              text: f.text || "Unknown risk detected",
              severity: f.severity === "HIGH" ? "HIGH" : "MEDIUM",
            }))
          : [],
        summary: scores.summary || "Analysis could not generate a detailed summary.",
      };
    } catch {
      // Fallback if Gemini returns unparseable response
      scores = {
        overallScore: 45,
        additionality: 42,
        permanence: 55,
        leakage: 38,
        communityImpact: 52,
        redFlags: [
          { text: "AI analysis unavailable — scores are estimated defaults", severity: "MEDIUM" },
        ],
        summary: "Live AI analysis is currently unavailable. Displaying estimated default scores.",
      };
    }

    return Response.json(scores);
  } catch (error) {
    console.error("Score API error:", error);
    return Response.json({
      overallScore: 45,
      additionality: 42,
      permanence: 55,
      leakage: 38,
      communityImpact: 52,
      redFlags: [
        { text: "AI analysis unavailable — scores are estimated defaults", severity: "MEDIUM" },
      ],
      summary: "Live AI analysis is currently unavailable. Displaying estimated default scores.",
    });
  }
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(val)));
}
