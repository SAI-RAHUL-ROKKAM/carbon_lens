import { IntegrityScore } from "@/types";

export async function getIntegrityScore(
  projectName: string,
  projectType: string,
  country: string,
  methodology: string,
  creditsIssued: number
): Promise<IntegrityScore> {
  const response = await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectName,
      projectType,
      country,
      methodology,
      creditsIssued,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get integrity score");
  }

  return response.json();
}
