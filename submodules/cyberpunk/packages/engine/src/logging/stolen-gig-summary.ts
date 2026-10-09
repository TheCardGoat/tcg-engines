import type { DieType } from "@tcg/cyberpunk-types";

export interface StolenGigLogEntry {
  dieType: DieType;
  faceValue: number;
}

/** Formats the public die information captured at the time of a Gig steal. */
export function formatStolenGigSummary(stolenGigs: readonly StolenGigLogEntry[]): string {
  const gigCount = stolenGigs.length;
  if (gigCount === 0) return "0 Gigs";

  const dieDetails = stolenGigs
    .map(({ dieType, faceValue }) => `${dieType.toUpperCase()} with value ${faceValue}`)
    .join("; ");
  return `${gigCount} Gig${gigCount === 1 ? "" : "s"} (${dieDetails})`;
}
