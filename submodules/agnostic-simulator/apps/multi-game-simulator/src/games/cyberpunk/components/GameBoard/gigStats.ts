import type { GigDieView } from "../../engine";

/**
 * Highest face per die type. A Gig sitting on this face is a "max Gig"
 * (comprehensive rules 6.3.2); every die type's lowest face is 1, so a
 * "min Gig" (6.3.1) is any die showing 1.
 */
export const GIG_DIE_MAX_FACE: Record<GigDieView["dieType"], number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
};

export interface GigSideStats {
  /** Sum of gig-area face values — the player's Street Cred (rule 11.2.1). */
  cred: number;
  /** Dice claimed into the gig area; reaching WIN_GIG_THRESHOLD wins (rule 1.10). */
  count: number;
  /** Dice showing their lowest face — "min Gigs" (rule 6.3.1). */
  minCount: number;
  /** Dice showing their highest face — "max Gigs" (rule 6.3.2). */
  maxCount: number;
  /** Dice whose face value is even (effects like "draw 2 if you control an even and an odd Gig"). */
  evenCount: number;
  /** Dice whose face value is odd (effects like "draw 1 for each friendly Gig with an odd value"). */
  oddCount: number;
  /**
   * Value-pairs in the gig area: two dice of the same value, where each Gig can
   * only count toward a single pair (rule 6.5.1) — three same-value dice make
   * exactly one pair.
   */
  pairs: number;
}

export function computeGigSideStats(dice: readonly GigDieView[]): GigSideStats {
  const valueCounts = new Map<number, number>();
  let cred = 0;
  let minCount = 0;
  let maxCount = 0;
  let evenCount = 0;
  let oddCount = 0;
  for (const die of dice) {
    cred += die.faceValue;
    if (die.faceValue === 1) {
      minCount += 1;
    }
    if (die.faceValue === GIG_DIE_MAX_FACE[die.dieType]) {
      maxCount += 1;
    }
    if (die.faceValue % 2 === 0) {
      evenCount += 1;
    } else {
      oddCount += 1;
    }
    valueCounts.set(die.faceValue, (valueCounts.get(die.faceValue) ?? 0) + 1);
  }
  let pairs = 0;
  for (const occurrences of valueCounts.values()) {
    pairs += Math.floor(occurrences / 2);
  }
  return { cred, count: dice.length, minCount, maxCount, evenCount, oddCount, pairs };
}

export interface GigHelperComparison {
  friendly: GigSideStats;
  rival: GigSideStats;
  /** Absolute Street Cred difference ("if your ☆ differs from a Rival's by 10+"). */
  credGap: number | null;
  credLeader: "friendly" | "rival" | "tied" | null;
}

export function compareGigStats(
  friendlyDice: readonly GigDieView[],
  rivalDice: readonly GigDieView[],
): GigHelperComparison {
  const friendly = computeGigSideStats(friendlyDice);
  const rival = computeGigSideStats(rivalDice);
  const canCompareCred = friendly.count > 0 && rival.count > 0;
  const credGap = canCompareCred ? Math.abs(friendly.cred - rival.cred) : null;
  const credLeader = !canCompareCred
    ? null
    : friendly.cred === rival.cred
      ? "tied"
      : friendly.cred > rival.cred
        ? "friendly"
        : "rival";
  return { friendly, rival, credGap, credLeader };
}
