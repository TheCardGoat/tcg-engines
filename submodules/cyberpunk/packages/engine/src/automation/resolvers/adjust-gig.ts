import { DIE_MAX_VALUES, isDieType, type CardColor } from "@tcg/cyberpunk-types";
import type { FilteredMatchView } from "../../view/filter.ts";
import { gigPlanValue } from "../util/gig-plan.ts";

interface GigCandidate {
  dieId: string;
  ownerId: string;
  currentValue: number;
  maxFaceValue: number;
}

export interface AdjustGigPlan {
  dieId: string;
  value: number;
  changed: boolean;
}

interface PlanAdjustGigOptions {
  view: FilteredMatchView;
  playerId: string;
  eligibleIds: readonly string[];
  direction?: string;
  maxAmount?: number;
  allowUnchanged?: boolean;
  sourceColor?: CardColor;
  focusedDie?: GigCandidate;
}

interface ScoredPlan extends AdjustGigPlan {
  score: number[];
  distance: number;
}

/**
 * Pick both the Gig and its resulting value from the public player view.
 *
 * The score mirrors the Color Tree's first-set identities:
 * - Red maximizes friendly Gig values.
 * - Blue creates min friendly Gigs and minimizes friendly Street Cred.
 * - Green aligns friendly values into pairs.
 * - Yellow keeps friendly values distinct, then widens Street Cred divergence.
 *
 * Rival-controlled Gigs take a separate disruption path regardless of source
 * color: reduce that rival's Street Cred first, then break value structure.
 * A missing source color falls back to maximizing Street Cred advantage (the
 * resolver's historical friendly-up / rival-down behavior).
 */
export function planAdjustGig(options: PlanAdjustGigOptions): AdjustGigPlan | null {
  const candidates = options.focusedDie
    ? [options.focusedDie]
    : collectGigCandidates(options.view, new Set(options.eligibleIds));
  const maxAmount = Math.max(0, options.maxAmount ?? 0);
  let best: ScoredPlan | null = null;

  for (const candidate of candidates) {
    for (const value of legalValues(
      candidate,
      options.direction,
      maxAmount,
      options.allowUnchanged === true,
    )) {
      const score = scoreResult(
        options.view,
        options.playerId,
        candidate,
        value,
        options.sourceColor,
      );
      const plan: ScoredPlan = {
        dieId: candidate.dieId,
        value,
        changed: value !== candidate.currentValue,
        score,
        distance: Math.abs(value - candidate.currentValue),
      };
      if (!best || comparePlans(plan, best) > 0) best = plan;
    }
  }

  return best ? { dieId: best.dieId, value: best.value, changed: best.changed } : null;
}

function collectGigCandidates(view: FilteredMatchView, eligibleIds: ReadonlySet<string>) {
  const candidates: GigCandidate[] = [];
  for (const [ownerId, player] of Object.entries(view.players)) {
    const gigArea = player.zones.gigArea;
    if (!Array.isArray(gigArea)) continue;
    for (const gig of gigArea) {
      if (!eligibleIds.has(gig.instanceId)) continue;
      if (!isDieType(gig.definitionId)) continue;
      const maxFaceValue = DIE_MAX_VALUES[gig.definitionId];
      candidates.push({
        dieId: gig.instanceId,
        ownerId,
        currentValue: gig.effectivePower,
        maxFaceValue,
      });
    }
  }
  return candidates;
}

function legalValues(
  candidate: GigCandidate,
  direction: string | undefined,
  maxAmount: number,
  allowUnchanged: boolean,
) {
  const min =
    direction === "increase"
      ? candidate.currentValue
      : Math.max(1, candidate.currentValue - maxAmount);
  const max =
    direction === "decrease"
      ? candidate.currentValue
      : Math.min(candidate.maxFaceValue, candidate.currentValue + maxAmount);
  const values: number[] = [];
  for (let value = min; value <= max; value++) {
    if (value !== candidate.currentValue || allowUnchanged) values.push(value);
  }
  return values;
}

function scoreResult(
  view: FilteredMatchView,
  playerId: string,
  candidate: GigCandidate,
  value: number,
  sourceColor: CardColor | undefined,
): number[] {
  const valuesByPlayer = new Map<string, number[]>();
  let foundCandidate = false;
  for (const [ownerId, player] of Object.entries(view.players)) {
    const gigArea = player.zones.gigArea;
    const values = Array.isArray(gigArea)
      ? gigArea.map((gig) => {
          if (gig.instanceId !== candidate.dieId) return gig.effectivePower;
          foundCandidate = true;
          return value;
        })
      : [];
    valuesByPlayer.set(ownerId, values);
  }
  if (!foundCandidate) {
    const ownerValues = valuesByPlayer.get(candidate.ownerId) ?? [];
    valuesByPlayer.set(candidate.ownerId, [...ownerValues, value]);
  }

  const ownValues = valuesByPlayer.get(playerId) ?? [];
  const rivalValues = [...valuesByPlayer.entries()]
    .filter(([ownerId]) => ownerId !== playerId)
    .map(([, values]) => values);
  const ownStreetCred = sum(ownValues);
  const rivalStreetCreds = rivalValues.map(sum);
  const strongestRivalStreetCred = Math.max(0, ...rivalStreetCreds);
  const streetCredAdvantage = ownStreetCred - strongestRivalStreetCred;

  if (candidate.ownerId !== playerId) {
    const adjustedRivalValues = valuesByPlayer.get(candidate.ownerId) ?? [];
    return [
      -sum(adjustedRivalValues),
      -pairCount(adjustedRivalValues),
      -new Set(adjustedRivalValues).size,
    ];
  }

  // A known card payoff takes precedence over a color's generic value shape.
  // With no visible payoff this prefix is equal for every candidate.
  const readyCardPlan = gigPlanValue(view, playerId, ownValues);

  switch (sourceColor) {
    case "red":
      return [readyCardPlan, ownStreetCred, streetCredAdvantage];
    case "blue":
      return [
        readyCardPlan,
        ownValues.filter((gigValue) => gigValue === 1).length,
        -ownStreetCred,
        streetCredAdvantage,
      ];
    case "green":
      return [
        readyCardPlan,
        pairCount(ownValues),
        -rivalValues.reduce((total, values) => total + pairCount(values), 0),
        streetCredAdvantage,
      ];
    case "yellow":
      return [
        readyCardPlan,
        new Set(ownValues).size,
        Math.max(0, ...rivalStreetCreds.map((cred) => Math.abs(ownStreetCred - cred))),
        streetCredAdvantage,
      ];
    default:
      return [readyCardPlan, streetCredAdvantage];
  }
}

function pairCount(values: readonly number[]): number {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  let pairs = 0;
  for (const count of counts.values()) pairs += (count * (count - 1)) / 2;
  return pairs;
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function comparePlans(a: ScoredPlan, b: ScoredPlan): number {
  const length = Math.max(a.score.length, b.score.length);
  for (let index = 0; index < length; index++) {
    const difference = (a.score[index] ?? 0) - (b.score[index] ?? 0);
    if (difference !== 0) return difference;
  }
  // When two outcomes express the color equally well, make the smallest
  // precise adjustment and then use stable ids/values for deterministic play.
  if (a.distance !== b.distance) return b.distance - a.distance;
  const idOrder = b.dieId.localeCompare(a.dieId);
  if (idOrder !== 0) return idOrder;
  return b.value - a.value;
}
