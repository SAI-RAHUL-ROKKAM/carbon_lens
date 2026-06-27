export function getScoreColor(score: number): string {
  if (score < 40) return "var(--accent-warn)";
  if (score < 70) return "#F5A623";
  return "var(--accent-primary)";
}

export function getScoreBg(score: number): string {
  if (score < 40) return "var(--accent-warn)";
  if (score < 70) return "#F5A623";
  return "var(--accent-primary)";
}

export function formatCredits(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function getCountryCoordinates(country: string): { lat: number; lng: number } {
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
  };
  return coords[country] || { lat: 0, lng: 0 };
}
