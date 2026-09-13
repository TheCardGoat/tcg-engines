/**
 * Value-blocking from Yuki Lee Bender's Masterclass: Defending
 * (https://fabtcg.com/articles/masterclass-defending/).
 *
 * A defend line is scored as life saved + on-hit prevented + leftover
 * offense (including one arsenal card). The compiler picks the legal set
 * with the highest total, including the empty "take it" line.
 */
import { type FabEffect, type FabTriggeredStaticAbility } from "@tcg/flesh-and-blood-types";
import type { FabObjectRef } from "../../rules/continuous/ir.ts";
import type { FabRulesView } from "../../rules/rules-view.ts";
import { fabTriggerObservesEvent } from "../../rules/trigger-patterns.ts";
import { cardValue, estimateOffensiveValue } from "./hand-value.ts";
export { cardValue, estimateOffensiveValue } from "./hand-value.ts";
import type {
  FabHeuristicCard,
  FabHeuristicSnapshot,
  FabLineRankingHint,
  FabLineRankingInput,
} from "./types.ts";

/** Article: a random extra card the opponent converts is ~3 value. */
export const ON_HIT_DRAW_VALUE = 3;
/** Unknown hit effects get a conservative floor. */
const UNKNOWN_ON_HIT_VALUE = 2;
const VALUE_SCALE = 25;
const DEFEND_BASE = 200;
const LETHAL_BONUS = 400;
const EQUIPMENT_BREAKPOINT_BONUS = 4;
const FIRST_TURN_GARBAGE_VALUE = 2;
/** CR 8.3.3: destroyed when it defends — losing the piece costs its whole body. */
const BLADE_BREAK_DEFEND_COST = 10;
/** CR 8.3.10: -1{d} per defend, destroyed at zero — each defend burns a defend. */
const TEMPER_DEFEND_COST = 4;
/** CR 8.3.2: permanent -1{d} counter per defend — small, gradual armor decay. */
const BATTLEWORN_DEFEND_COST = 2;

export interface FabDefendValueBreakdown {
  readonly lifeSaved: number;
  readonly damageTaken: number;
  readonly survives: boolean;
  readonly onHitPrevented: number;
  readonly leftoverOffense: number;
  readonly equipmentPenalty: number;
  readonly total: number;
}

export function estimateOnHitValue(
  view: FabRulesView,
  attackRef: FabObjectRef,
  zones: {
    readonly hand: readonly FabHeuristicCard[];
    readonly arsenal: readonly FabHeuristicCard[];
  },
): number {
  let value = 0;
  for (const ability of view.functionalAbilities(attackRef)) {
    if (
      ability.kind !== "static" ||
      ability.staticKind !== "triggered" ||
      !fabTriggerObservesEvent(ability.trigger, "hit")
    )
      continue;
    value += triggeredOnHitValue(ability, zones);
  }
  return value;
}

export function evaluateDefendSet(
  snapshot: FabHeuristicSnapshot,
  instanceIds: readonly string[],
): FabDefendValueBreakdown {
  const remaining = snapshot.remainingDamage ?? 0;
  let defense = 0;
  let handCards = 0;
  const equipmentUsed: FabHeuristicCard[] = [];
  const spent = new Set(instanceIds);
  for (const id of instanceIds) {
    const card = findCard(snapshot, id);
    defense += card?.defense ?? 0;
    if (card?.isEquipment) equipmentUsed.push(card);
    else handCards += 1;
  }
  const lifeSaved = Math.min(defense, remaining);
  const damageTaken = remaining - lifeSaved;
  const survives = damageTaken < snapshot.life;
  const covers = remaining > 0 && defense >= remaining;
  const onHitPrevented = covers ? snapshot.attackOnHitValue : 0;
  const leftoverOffense = snapshot.refillsHandAtEndOfTurn
    ? firstTurnRetainedValue(snapshot, spent)
    : estimateOffensiveValue({
        hand: snapshot.hand.filter((card) => !spent.has(card.instanceId)),
        arsenal: snapshot.arsenal.filter((card) => !spent.has(card.instanceId)),
        arsenalHasRoom: snapshot.arsenalHasRoom,
      });
  const lethal = remaining >= snapshot.life && snapshot.life > 0;
  const equipmentPenalty = equipmentFuturePenalty(snapshot, {
    equipment: equipmentUsed,
    covers,
    remaining,
    lethal,
  });
  let total = lifeSaved + onHitPrevented + leftoverOffense - equipmentPenalty;
  if (covers && equipmentUsed.length > 0 && handCards <= 1 && snapshot.attackOnHitValue > 0) {
    total += EQUIPMENT_BREAKPOINT_BONUS;
  }
  // Masterclass: Mirror Matches — deny the opponent's copy of your on-hits.
  if (snapshot.isMirror && covers && snapshot.attackOnHitValue > 0) {
    total += 3;
  }
  if (snapshot.attackHasGoAgain && remaining <= 3 && !lethal && handCards >= 2) {
    total -= 4;
  }
  // Once the current attack cannot naturally refund an action point, weak hand
  // cards are often better exchanged for fresh cards at the turn-one refill.
  // This only breaks ties after damage/on-hit prevention and never values
  // arsenal or equipment as disposable.
  if (snapshot.refillsHandAtEndOfTurn && !snapshot.attackHasGoAgain && covers) {
    total += firstTurnCycleValue(snapshot, spent);
  }
  if (lethal && survives) total += 8;
  if (lethal && !survives) total -= 20;
  return {
    lifeSaved,
    damageTaken,
    survives,
    onHitPrevented,
    leftoverOffense,
    equipmentPenalty,
    total,
  };
}

/**
 * On the defending half of turn 1, retained hand cards are not next-turn
 * offense: CR 4.4.3f replaces them. Keep only a compact current-combat reserve
 * in the value calculation, while still giving arsenal its normal future value.
 */
function firstTurnRetainedValue(
  snapshot: FabHeuristicSnapshot,
  spent: ReadonlySet<string>,
): number {
  const retainedHand = snapshot.hand.filter((card) => !spent.has(card.instanceId));
  const retainedArsenal = snapshot.arsenal.filter((card) => !spent.has(card.instanceId));
  const arsenalValue = estimateOffensiveValue({
    hand: [],
    arsenal: retainedArsenal,
    arsenalHasRoom: snapshot.arsenalHasRoom,
  });
  if (retainedHand.length === 0) return arsenalValue;

  // Preserve the strongest card as a reaction / next-link reserve. When the
  // attack has go again, defense matters most; otherwise retain raw card value.
  const reserve = Math.max(
    ...retainedHand.map((card) =>
      snapshot.attackHasGoAgain ? Math.max(card.defense, cardValue(card)) : cardValue(card),
    ),
  );
  return arsenalValue + reserve;
}

function firstTurnCycleValue(snapshot: FabHeuristicSnapshot, spent: ReadonlySet<string>): number {
  return snapshot.hand
    .filter((card) => spent.has(card.instanceId))
    .reduce((value, card) => value + Math.max(0, FIRST_TURN_GARBAGE_VALUE - cardValue(card)), 0);
}

export function scoreDefendSet(
  snapshot: FabHeuristicSnapshot,
  instanceIds: readonly string[],
  ranking: FabLineRankingInput,
): number {
  if (ranking.persona === "never-defend" && instanceIds.length > 0) {
    return Number.NEGATIVE_INFINITY;
  }
  const remaining = snapshot.remainingDamage;
  if (remaining === null) return 100;
  if (remaining <= 0 && instanceIds.length > 0) return -50;

  const breakdown = evaluateDefendSet(snapshot, instanceIds);
  let score = DEFEND_BASE + breakdown.total * VALUE_SCALE;
  if (ranking.persona === "defend-only" && breakdown.lifeSaved > 0) score += 180;
  if (ranking.persona === "defend-only" && instanceIds.length === 0 && remaining > 0) {
    score -= 80;
  }
  const remainingLife = remaining >= snapshot.life && snapshot.life > 0;
  if (remainingLife && breakdown.survives) score += LETHAL_BONUS;

  for (const id of instanceIds) {
    const card = findCard(snapshot, id);
    if (prefersDefend(ranking.hint, card, id)) score += 80;
    if (
      card &&
      !card.isEquipment &&
      card.isAttack &&
      card.power >= 5 &&
      !remainingLife &&
      breakdown.onHitPrevented === 0
    ) {
      score -= card.power * 4;
    }
  }
  return score;
}

/**
 * Equipment survives defending (it stays equipped when the combat chain
 * closes), so a pristine piece costs nothing to defend with and is the
 * Masterclass-preferred substitute for hand cards. Only degradation
 * keywords make an equipment defend a real expense:
 * blade-break destroys the piece, temper burns one of its finite defends,
 * battleworn permanently decays its defense by one.
 */
function equipmentFuturePenalty(
  snapshot: FabHeuristicSnapshot,
  input: {
    readonly equipment: readonly FabHeuristicCard[];
    readonly covers: boolean;
    readonly remaining: number;
    readonly lethal: boolean;
  },
): number {
  if (input.equipment.length === 0) return 0;
  if (input.lethal || snapshot.life <= 8) return 0;
  // Stopping an on-hit / breakpoint is the highest-EV equipment defend
  // (Masterclass: Equipment); never price it out of the block.
  if (snapshot.attackOnHitValue > 0 && input.covers) return 0;
  let penalty = 0;
  for (const card of input.equipment) {
    penalty += card.hasBladeBreak
      ? BLADE_BREAK_DEFEND_COST
      : card.hasTemper
        ? TEMPER_DEFEND_COST
        : card.hasBattleworn
          ? BATTLEWORN_DEFEND_COST
          : 0;
  }
  return penalty;
}

function triggeredOnHitValue(
  ability: FabTriggeredStaticAbility,
  zones: {
    readonly hand: readonly FabHeuristicCard[];
    readonly arsenal: readonly FabHeuristicCard[];
  },
): number {
  const resolution = ability.resolution;
  switch (resolution.kind) {
    case "effect":
      return effectOnHitValue(resolution.effect, zones);
    case "modal": {
      const values = resolution.modes.map((mode) => effectOnHitValue(mode.effect, zones));
      const count = Math.max(0, Math.floor(amountValue(resolution.choose)));
      const modeValue = resolution.random
        ? (values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length)) * count
        : resolution.allowRepeat
          ? Math.max(0, ...values) * count
          : values
              .sort((left, right) => right - left)
              .slice(0, count)
              .reduce((sum, value) => sum + value, 0);
      return modeValue + (resolution.effect ? effectOnHitValue(resolution.effect, zones) : 0);
    }
    default: {
      const exhaustive: never = resolution;
      return exhaustive;
    }
  }
}

function effectOnHitValue(
  effect: FabEffect,
  zones: {
    readonly hand: readonly FabHeuristicCard[];
    readonly arsenal: readonly FabHeuristicCard[];
  },
): number {
  switch (effect.type) {
    case "sequence":
      return effect.steps.reduce((sum, step) => sum + effectOnHitValue(step, zones), 0);
    case "choice":
      return Math.max(0, ...effect.options.map((option) => effectOnHitValue(option, zones)));
    case "conditional":
      return Math.max(
        effectOnHitValue(effect.then, zones),
        effect.else ? effectOnHitValue(effect.else, zones) : 0,
      );
    case "optional":
      return effectOnHitValue(effect.effect, zones);
    case "draw":
      return ON_HIT_DRAW_VALUE * amountValue(effect.count);
    case "deal-damage":
    case "gain-life":
    case "lose-life":
      return amountValue(effect.amount);
    case "discard":
    case "banish":
    case "move-card":
      return disruptionValue(zones);
    default:
      return UNKNOWN_ON_HIT_VALUE;
  }
}

function disruptionValue(zones: {
  readonly hand: readonly FabHeuristicCard[];
  readonly arsenal: readonly FabHeuristicCard[];
}): number {
  const cards = [...zones.hand, ...zones.arsenal];
  if (cards.length === 0) return 0;
  return Math.max(...cards.map(cardValue));
}

function amountValue(amount: unknown): number {
  return typeof amount === "number" && Number.isFinite(amount) ? amount : 1;
}

function findCard(
  snapshot: FabHeuristicSnapshot,
  instanceId: string,
): FabHeuristicCard | undefined {
  return (
    snapshot.hand.find((card) => card.instanceId === instanceId) ??
    snapshot.arsenal.find((card) => card.instanceId === instanceId) ??
    snapshot.equipment.find((card) => card.instanceId === instanceId)
  );
}

function prefersDefend(
  hint: FabLineRankingHint | undefined,
  card: FabHeuristicCard | undefined,
  instanceId: string,
): boolean {
  if (!hint) return false;
  const preferred = hint.preferred;
  if (!preferred || (preferred.role && preferred.role !== "defend")) return false;
  if (preferred.instanceId === instanceId) return true;
  if (card && preferred.canonicalId === card.canonicalId) return true;
  if (card && preferred.name && card.name.toLowerCase().includes(preferred.name.toLowerCase())) {
    return true;
  }
  return false;
}
