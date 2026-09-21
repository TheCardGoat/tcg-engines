/**
 * Opening-hand summary for the mulligan prompt.
 *
 * The mulligan is a free full redraw (comprehensive rules 7.9.2–7.9.3.3), so
 * the decision is purely "is this hand good enough" — the stats below are the
 * three signals that answer it: sellable count (rules 3.12.1, 8.11, 11.9 —
 * only Sell-Tag cards can be sold, one Sell action per turn), the Eddie-cost
 * curve, and the unit/non-unit split.
 */

/** Cost bands. The low ceiling matches the automation keep bar
 * (`mulliganCheapCostThreshold` in cyberpunk engine's greedy strategy): under
 * the 1-Eddie/turn pacing, 1–2 cost cards are the plays the first turns run
 * on, 3–5 needs the Sell ramp, 6+ are late payoffs. */
export const MULLIGAN_LOW_COST_MAX = 2;
export const MULLIGAN_MID_COST_MAX = 5;

/**
 * The generic automation keep bar (greedy strategy `shouldMulligan`): keep
 * when at least 2 cards cost ≤2 and at least 1 card is sellable. The prompt
 * highlights chips against the same bar so its emphasis matches how the
 * game's own bot evaluates a hand. Deck-aware profiles may disagree; the bar
 * is a hint, never a verdict.
 */
export const MULLIGAN_KEEP_BAR = {
  minLowCostCards: 2,
  minSellableCards: 1,
} as const;

/** Minimal structural hand-card view — satisfied by the simulator's ZoneCardView. */
export interface MulliganStatsCard {
  cost: number | null;
  cardType: string | null;
  hasSellTag: boolean;
  faceDown: boolean;
  /** Online UX: identity shown this turn despite faceDown. */
  revealed?: boolean;
}

export interface MulliganHandStats {
  /** Cards summarized (face-up to the viewer). */
  counted: number;
  /** Hand cards hidden from the viewer — excluded from every other count. */
  hidden: number;
  /** Cards costing 1–2 Eddies. */
  lowCost: number;
  /** Cards costing 3–5 Eddies. */
  midCost: number;
  /** Cards costing 6+ Eddies. */
  highCost: number;
  /** Visible cards with no printed cost (not expected in an opening hand). */
  uncosted: number;
  units: number;
  nonUnits: number;
  /** Cards carrying the Sell Tag. */
  sellable: number;
}

export function isVisibleForMulliganStats(card: MulliganStatsCard): boolean {
  return !card.faceDown || card.revealed === true;
}

export function computeMulliganStats(hand: readonly MulliganStatsCard[]): MulliganHandStats {
  const stats: MulliganHandStats = {
    counted: 0,
    hidden: 0,
    lowCost: 0,
    midCost: 0,
    highCost: 0,
    uncosted: 0,
    units: 0,
    nonUnits: 0,
    sellable: 0,
  };
  for (const card of hand) {
    if (!isVisibleForMulliganStats(card)) {
      stats.hidden += 1;
      continue;
    }
    stats.counted += 1;
    if (typeof card.cost === "number") {
      if (card.cost <= MULLIGAN_LOW_COST_MAX) {
        stats.lowCost += 1;
      } else if (card.cost <= MULLIGAN_MID_COST_MAX) {
        stats.midCost += 1;
      } else {
        stats.highCost += 1;
      }
    } else {
      stats.uncosted += 1;
    }
    if (card.cardType === "unit") {
      stats.units += 1;
    } else {
      stats.nonUnits += 1;
    }
    if (card.hasSellTag) {
      stats.sellable += 1;
    }
  }
  return stats;
}

export function meetsMulliganKeepBar(stats: MulliganHandStats): boolean {
  return (
    stats.lowCost >= MULLIGAN_KEEP_BAR.minLowCostCards &&
    stats.sellable >= MULLIGAN_KEEP_BAR.minSellableCards
  );
}
