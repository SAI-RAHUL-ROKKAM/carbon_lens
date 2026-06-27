export interface CarbonProject {
  id: string;
  name: string;
  country: string;
  projectType: string;
  methodology?: string;
  creditsIssued: number;
  proponent?: string;
  coordinates?: { lat: number; lng: number };
  status?: string;
}

export interface IntegrityScore {
  overallScore: number;
  additionality: number;
  permanence: number;
  leakage: number;
  communityImpact: number;
  redFlags: RedFlag[];
  summary: string;
}

export interface RedFlag {
  text: string;
  severity: "HIGH" | "MEDIUM";
}

export interface SearchResult extends CarbonProject {
  integrityScore?: number;
}

export interface LeaderboardProject extends CarbonProject {
  integrityScore: number;
}
