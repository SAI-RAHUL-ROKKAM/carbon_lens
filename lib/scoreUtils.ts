export function getScoreColor(score: number): string {
  if (score < 40) return "var(--accent-warn)";
  if (score < 60) return "#F5A623";
  return "var(--accent-primary)";
}

export function getScoreBg(score: number): string {
  if (score < 40) return "var(--accent-warn)";
  if (score < 60) return "#F5A623";
  return "var(--accent-primary)";
}

export function formatCredits(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function getCountryCoordinates(country: string): { lat: number; lng: number } | null {
  const coords: Record<string, { lat: number; lng: number }> = {
    Zimbabwe: { lat: -19.015, lng: 29.154 },
    Peru: { lat: -9.19, lng: -75.015 },
    Indonesia: { lat: -0.789, lng: 113.921 },
    Kenya: { lat: -0.024, lng: 37.906 },
    Brazil: { lat: -14.235, lng: -51.925 },
    Colombia: { lat: 4.571, lng: -74.297 },
    "Democratic Republic of Congo": { lat: -4.038, lng: 21.759 },
    India: { lat: 20.594, lng: 78.963 },
    Cambodia: { lat: 12.566, lng: 104.991 },
    Guatemala: { lat: 15.784, lng: -90.231 },
    Mexico: { lat: 23.635, lng: -102.553 },
    China: { lat: 35.862, lng: 104.195 },
    Thailand: { lat: 15.87, lng: 100.993 },
    Vietnam: { lat: 14.058, lng: 108.277 },
    Myanmar: { lat: 21.914, lng: 95.956 },
    Ethiopia: { lat: 9.145, lng: 40.489 },
    Tanzania: { lat: -6.369, lng: 34.889 },
    Mozambique: { lat: -18.666, lng: 35.529 },
    Madagascar: { lat: -18.767, lng: 46.869 },
    "Papua New Guinea": { lat: -6.315, lng: 143.956 },
    Malawi: { lat: -13.254, lng: 34.302 },
    "Costa Rica": { lat: 9.749, lng: -83.754 },
    Ecuador: { lat: -1.831, lng: -78.183 },
    Philippines: { lat: 12.879, lng: 121.774 },
    Nigeria: { lat: 9.082, lng: 8.675 },
    Rwanda: { lat: -1.94, lng: 29.87 },
    Uganda: { lat: 1.37, lng: 32.29 },
    Honduras: { lat: 14.1, lng: -87.2 },
    Argentina: { lat: -38.416, lng: -63.617 },
    Chile: { lat: -35.675, lng: -71.543 },
    Bolivia: { lat: -16.29, lng: -63.588 },
    "South Africa": { lat: -30.559, lng: 22.937 },
    Zambia: { lat: -13.134, lng: 27.849 },
    Ghana: { lat: 7.946, lng: -1.024 },
    Cameroon: { lat: 7.369, lng: 12.354 },
    Nepal: { lat: 28.394, lng: 84.124 },
    Laos: { lat: 19.856, lng: 102.495 },
    Malaysia: { lat: 4.21, lng: 101.976 },
    Guyana: { lat: 4.861, lng: -58.93 },
    Suriname: { lat: 3.919, lng: -56.028 },
    Congo: { lat: -0.228, lng: 15.828 },
    "Ivory Coast": { lat: 7.54, lng: -5.547 },
    Liberia: { lat: 6.428, lng: -9.429 },
    "Sierra Leone": { lat: 8.461, lng: -11.779 },
    Belize: { lat: 17.19, lng: -88.497 },
    Paraguay: { lat: -23.442, lng: -58.444 },
    Nicaragua: { lat: 12.865, lng: -85.207 },
    Panama: { lat: 8.538, lng: -80.782 },
    "Dominican Republic": { lat: 18.736, lng: -70.163 },
    Haiti: { lat: 18.971, lng: -72.285 },
  };
  return coords[country] || null;
}
