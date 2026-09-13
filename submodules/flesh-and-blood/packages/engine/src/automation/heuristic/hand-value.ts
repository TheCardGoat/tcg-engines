import type { FabHeuristicCard } from "./types.ts";

export interface FabOffensiveEstimateInput {
  readonly hand: readonly FabHeuristicCard[];
  readonly arsenal: readonly FabHeuristicCard[];
  readonly arsenalHasRoom: boolean;
  readonly resourcePoints?: number;
  readonly actionPoints?: number;
  readonly firstPlayInstanceId?: string;
  /** A one-at-a-time payment answer being compared for the announced attack. */
  readonly requiredFirstPitchInstanceIds?: readonly string[];
}

export interface FabHandPlan {
  readonly value: number;
  readonly damage: number;
  readonly playInstanceId: string | null;
  readonly pitchInstanceIds: readonly string[];
  readonly arsenalInstanceId: string | null;
}

const MAX_STATES = 2_048;
const ARSENAL_DISCOUNT = 0.7;

/**
 * Bounded hand valuation, not an alternative rules engine. Uses evaluated
 * attack costs/power/go again to compare orders and payment bundles. Only
 * hand cards may pitch; surplus resources fund subsequent attacks. Unknown
 * draws and future conditional effects are deliberately not predicted here.
 */
export function planHandOffense(input: FabOffensiveEstimateInput): FabHandPlan {
  const memo = new Map<string, FabHandPlan>();
  let states = 0;
  let transitions = 0;
  const visit = (
    hand: readonly FabHeuristicCard[],
    arsenal: readonly FabHeuristicCard[],
    resources: number,
    actionPoints: number,
    first = false,
  ): FabHandPlan => {
    const room = input.arsenalHasRoom || arsenal.length < input.arsenal.length;
    const reserve = room
      ? hand.reduce<FabHeuristicCard | null>(
          (best, card) => (arsenalValue(card) > (best ? arsenalValue(best) : 0) ? card : best),
          null,
        )
      : null;
    let best: FabHandPlan = {
      value:
        first && input.firstPlayInstanceId
          ? Number.NEGATIVE_INFINITY
          : arsenal.reduce((sum, card) => sum + arsenalValue(card), 0) +
            (reserve ? arsenalValue(reserve) : 0),
      damage: 0,
      playInstanceId: null,
      pitchInstanceIds: [],
      arsenalInstanceId: reserve?.instanceId ?? null,
    };
    if (actionPoints <= 0 || states >= MAX_STATES) return best;
    const key = JSON.stringify([
      hand.map((card) => card.instanceId),
      arsenal.map((card) => card.instanceId),
      resources,
      actionPoints,
    ]);
    const cached = memo.get(key);
    if (cached) return cached;
    states++;
    attacks: for (const attack of [...hand, ...arsenal]) {
      if (!attack.isAttack) continue;
      // CR 8.2.6a: an arrow's normal play origin is arsenal.
      if (attack.subtypes.includes("Arrow") && hand.includes(attack)) continue;
      if (first && input.firstPlayInstanceId && attack.instanceId !== input.firstPlayInstanceId)
        continue;
      const available = hand.filter((card) => card.instanceId !== attack.instanceId);
      for (const pitched of paymentBundles(available, Math.max(0, attack.cost - resources))) {
        if (
          first &&
          input.requiredFirstPitchInstanceIds?.some(
            (id) => !pitched.some((card) => card.instanceId === id),
          )
        )
          continue;
        if (transitions++ >= MAX_STATES) break attacks;
        const pitchIds = new Set(pitched.map((card) => card.instanceId));
        const retained = available.filter((card) => !pitchIds.has(card.instanceId));
        const discards = discardBundles(retained, attack.additionalHandDiscard);
        if (discards.length === 0) continue;
        const remainingArsenal = arsenal.filter((card) => card.instanceId !== attack.instanceId);
        const nextResources =
          resources + pitched.reduce((sum, card) => sum + card.pitch, 0) - attack.cost;
        const nextAP = actionPoints - 1 + Number(attack.hasGoAgain);
        // Required discard identity is not preserved by the compact snapshot.
        // Average the possible payments instead of pretending a random discard
        // always removes the weakest card.
        const tails = discards.map((discarded) => {
          const ids = new Set(discarded.map((card) => card.instanceId));
          return visit(
            retained.filter((card) => !ids.has(card.instanceId)),
            remainingArsenal,
            nextResources,
            nextAP,
          );
        });
        const tailValue = tails.reduce((sum, tail) => sum + tail.value, 0) / tails.length;
        const damage =
          attack.power + tails.reduce((sum, tail) => sum + tail.damage, 0) / tails.length;
        const value = attack.power + tailValue;
        if (value > best.value || (value === best.value && damage > best.damage))
          best = {
            value,
            damage,
            playInstanceId: attack.instanceId,
            pitchInstanceIds: [...pitchIds],
            arsenalInstanceId: tails.length === 1 ? tails[0]!.arsenalInstanceId : null,
          };
      }
    }
    memo.set(key, best);
    return best;
  };
  return visit(input.hand, input.arsenal, input.resourcePoints ?? 0, input.actionPoints ?? 1, true);
}

function paymentBundles(
  cards: readonly FabHeuristicCard[],
  needed: number,
): readonly (readonly FabHeuristicCard[])[] {
  if (needed <= 0) return [[]];
  const choices: FabHeuristicCard[][] = [];
  let visited = 0;
  const visit = (start: number, chosen: readonly FabHeuristicCard[], total: number) => {
    if (choices.length >= 256 || visited++ >= MAX_STATES) return;
    if (total >= needed) {
      // Paying extra cards cannot help this line: keep only minimal bundles.
      if (chosen.every((card) => total - card.pitch < needed)) choices.push([...chosen]);
      return;
    }
    for (let i = start; i < cards.length; i++) {
      const card = cards[i]!;
      if (card.pitch > 0) visit(i + 1, [...chosen, card], total + card.pitch);
    }
  };
  visit(0, [], 0);
  return choices;
}

function discardBundles(
  cards: readonly FabHeuristicCard[],
  count: number,
): readonly (readonly FabHeuristicCard[])[] {
  if (count <= 0) return [[]];
  if (cards.length < count) return [];
  const choices: FabHeuristicCard[][] = [];
  const visit = (start: number, chosen: readonly FabHeuristicCard[]) => {
    if (choices.length >= 256) return;
    if (chosen.length === count) {
      choices.push([...chosen]);
      return;
    }
    for (let i = start; i <= cards.length - (count - chosen.length); i++)
      visit(i + 1, [...chosen, cards[i]!]);
  };
  visit(0, []);
  return choices;
}

export function estimateOffensiveValue(input: FabOffensiveEstimateInput): number {
  return planHandOffense(input).value;
}

export function cardValue(card: FabHeuristicCard): number {
  return Math.max(card.power, card.defense);
}

export function arsenalValue(card: FabHeuristicCard): number {
  // CR 8.1.7a: Resource cards cannot be played. Saving one here strands pitch.
  return card.isResource ? 0 : cardValue(card) * ARSENAL_DISCOUNT;
}
