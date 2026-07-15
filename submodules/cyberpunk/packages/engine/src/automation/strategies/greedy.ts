import type { AIStrategy, DecisionContext, MoveDecision } from "../types.ts";
import type {
  AbilityCandidate,
  AvailableMove,
  PlayCardCandidate,
} from "../../view/player-prompt.ts";
import type { FilteredCardView, FilteredMatchView } from "../../view/filter.ts";
import type { MoveId } from "../../moves/index.ts";
import { decisionFromMove, type PlayCardPick } from "./move-args.ts";
import { assertNever } from "../util/assert-never.ts";

/**
 * Tunable weights for the greedy strategy. Every threshold or priority the
 * strategy uses to decide between actions is surfaced here so the training
 * harness (`tools/ai-runner train`) can search over them without touching code.
 *
 * Priority maps: higher number → considered earlier. Any `MoveId` missing
 * from a map gets priority 0 (last resort), except `concede`, which is only
 * considered after every other legal move. Mulligan is handled by the opening
 * hand heuristic before the priority map is consulted, so the map is only a
 * tie-breaker for later prompts.
 */
export interface GreedyWeights {
  /** Own gigCount at which we switch to "close the game" mode. */
  ownNearWinThreshold: number;
  /** Rival gigCount at which we switch to "defend hand size" mode. */
  rivalNearWinThreshold: number;
  /** Minimum count of cheap cards in opening hand to keep. */
  mulliganMinCheapCards: number;
  /** Cost cutoff for "cheap" in the mulligan heuristic. */
  mulliganCheapCostThreshold: number;
  /** Minimum sell-tag cards in opening hand to keep. */
  mulliganMinSellable: number;
  /** Minimum power margin (attacker - defender) required to declare a unit fight. */
  fightMinMargin: number;
  /** Move priorities for the default game state. */
  defaultPriority: Partial<Record<MoveId, number>>;
  /** Move priorities when we're at gigCount ≥ ownNearWinThreshold. */
  ownNearWinPriority: Partial<Record<MoveId, number>>;
  /** Move priorities when the rival is at gigCount ≥ rivalNearWinThreshold. */
  rivalNearWinPriority: Partial<Record<MoveId, number>>;
}

/**
 * Default weights for the production-like heuristic. The priority numbers are
 * derived from ordered lists by assigning descending integers.
 */
export const DEFAULT_GREEDY_WEIGHTS: GreedyWeights = {
  ownNearWinThreshold: 5,
  rivalNearWinThreshold: 5,
  mulliganMinCheapCards: 2,
  mulliganCheapCostThreshold: 2,
  mulliganMinSellable: 1,
  fightMinMargin: 1,
  defaultPriority: priorityFromOrder([
    "mulligan",
    "keepHand",
    "attackRival",
    "attackUnit",
    "activateAbility",
    "playCard",
    "callLegend",
    "sellCard",
    "useBlocker",
    "passPhase",
    "resolveAttack",
  ]),
  ownNearWinPriority: priorityFromOrder([
    "attackRival",
    "attackUnit",
    "activateAbility",
    "useBlocker",
    "playCard",
    "callLegend",
    "passPhase",
    "resolveAttack",
    "sellCard",
    "mulligan",
  ]),
  rivalNearWinPriority: priorityFromOrder([
    "attackRival",
    "attackUnit",
    "activateAbility",
    "playCard",
    "callLegend",
    "useBlocker",
    "passPhase",
    "resolveAttack",
    "sellCard",
    "mulligan",
  ]),
};

function priorityFromOrder(order: MoveId[]): Partial<Record<MoveId, number>> {
  const map: Partial<Record<MoveId, number>> = {};
  for (let i = 0; i < order.length; i++) {
    map[order[i] as MoveId] = order.length - i;
  }
  return map;
}

function cloneWeights(weights: GreedyWeights): GreedyWeights {
  return {
    ...weights,
    defaultPriority: { ...weights.defaultPriority },
    ownNearWinPriority: { ...weights.ownNearWinPriority },
    rivalNearWinPriority: { ...weights.rivalNearWinPriority },
  };
}

function orderFromPriority(map: Partial<Record<MoveId, number>>, moves: AvailableMove[]): MoveId[] {
  const priorityOf = (id: MoveId): number =>
    id === "concede" ? Number.NEGATIVE_INFINITY : (map[id] ?? 0);
  const ids = moves.map((m) => m.moveId);
  return [...new Set(ids)].sort((a, b) => {
    const av = priorityOf(a);
    const bv = priorityOf(b);
    if (av !== bv) return bv - av;
    return a.localeCompare(b);
  });
}

/**
 * A simple but functional opponent. Priority order, top-down:
 *
 *   1. End of turn: pass to attack phase / pass to end so we draw + take a gig
 *   2. Attack the rival when a ready blocker cannot profitably eat the attacker
 *   3. Attack a spent rival unit only when our attacker survives the fight
 *   4. Play the highest-cost playable card (units > programs > gear/legends)
 *   5. Call a face-down legend if we can afford it
 *   6. Sell the cheapest sellable card
 *   7. Pass the phase
 *
 * The strategy never accesses raw state — only `ctx.view` and `ctx.prompt`.
 */
/**
 * Build a greedy strategy with a custom weight set. The default export
 * `greedyStrategy` is `createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS)`.
 */
export function createGreedyStrategy(
  weights: GreedyWeights = DEFAULT_GREEDY_WEIGHTS,
  name = "greedy",
): AIStrategy {
  const strategyWeights = cloneWeights(weights);
  return {
    name,
    decideAction(ctx) {
      const mulliganMove = ctx.prompt.availableMoves.find((m) => m.moveId === "mulligan");
      const wantsMulligan = shouldMulligan(ctx, strategyWeights);
      if (mulliganMove && wantsMulligan) {
        return { kind: "command", move: "mulligan" };
      }

      const moveOrder = priorityOrder(ctx, strategyWeights);
      for (const moveId of moveOrder) {
        if (moveId === "mulligan" && !wantsMulligan) continue;
        const available = ctx.prompt.availableMoves.find((m) => m.moveId === moveId);
        if (!available) continue;
        const decision = pickArgsFor(available, ctx, strategyWeights);
        if (decision.kind === "command") return decision;
      }
      return { kind: "stuck", reason: "greedy: no priority move yielded a command" };
    },
  };
}

export const greedyStrategy: AIStrategy = createGreedyStrategy();
export const defaultStrategy: AIStrategy = createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS, "default");

/**
 * Mulligan heuristic. The opening hand is 6 cards, the rules give one shuffle-
 * back-and-redraw before play. Keep when the curve looks playable; mulligan
 * when the hand is bricked.
 *
 *   - Keep if at least 2 cards cost ≤ 2 (we can deploy on turn 1-2 with the
 *     1-eddie/turn pacing) AND the hand has at least 1 sellable card (the
 *     primary eddie ramp in alpha).
 *   - Otherwise mulligan and re-roll.
 */
export function shouldMulligan(
  ctx: DecisionContext,
  weights: GreedyWeights = DEFAULT_GREEDY_WEIGHTS,
): boolean {
  const hand = getOwnHand(ctx);
  if (hand.length === 0) return false;
  const cheap = hand.filter(
    (c) => (c.cost ?? Number.POSITIVE_INFINITY) <= weights.mulliganCheapCostThreshold,
  ).length;
  const sellable = hand.filter((c) => c.hasSellTag).length;
  return cheap < weights.mulliganMinCheapCards || sellable < weights.mulliganMinSellable;
}

function getOwnHand(ctx: DecisionContext): FilteredCardView[] {
  const player = ctx.view.players?.[ctx.playerId as string];
  if (!player) return [];
  const handZone = player.zones.hand;
  if (!Array.isArray(handZone)) return [];
  return handZone;
}

function priorityOrder(ctx: DecisionContext, weights: GreedyWeights): MoveId[] {
  const { ownGigCount, rivalGigCount } = getGigCounts(ctx);
  const ownNearWin = ownGigCount >= weights.ownNearWinThreshold;
  const rivalNearWin = rivalGigCount >= weights.rivalNearWinThreshold;

  const map = ownNearWin
    ? weights.ownNearWinPriority
    : rivalNearWin
      ? weights.rivalNearWinPriority
      : weights.defaultPriority;
  return orderFromPriority(map, ctx.prompt.availableMoves);
}

function getGigCounts(ctx: DecisionContext): { ownGigCount: number; rivalGigCount: number } {
  const ownId = ctx.playerId as string;
  const players = ctx.view.players;
  if (!players) return { ownGigCount: 0, rivalGigCount: 0 };
  let ownGigCount = 0;
  let rivalGigCount = 0;
  for (const [pid, player] of Object.entries(players)) {
    if (pid === ownId) ownGigCount = player.gigCount;
    else rivalGigCount = player.gigCount;
  }
  return { ownGigCount, rivalGigCount };
}

function pickArgsFor(
  available: AvailableMove,
  ctx: DecisionContext,
  weights: GreedyWeights,
): MoveDecision {
  const { moveId, inputSpec } = available;
  switch (moveId) {
    case "playCard":
      if (inputSpec.type !== "playCard") break;
      return decisionFromMove(available, {
        pickFromCandidates: () => null,
        pickPair: () => null,
        pickPlayCard: (cands) => pickPlayCardForBoard(cands, ctx.view, ctx.playerId as string),
      });
    case "sellCard":
      if (inputSpec.type !== "selectCard") break;
      return decisionFromMove(available, {
        pickFromCandidates: (cands) => pickCardToSell(cands, ctx.view, ctx.playerId as string),
        pickPair: () => null,
      });
    case "attackUnit":
      if (inputSpec.type !== "selectPair") break;
      return decisionFromMove(available, {
        pickFromCandidates: () => null,
        pickPair: (from, to) =>
          pickFavourableFight(from, to, ctx.view, ctx.playerId as string, weights.fightMinMargin),
      });
    case "attackRival":
      if (inputSpec.type !== "selectCard") break;
      return decisionFromMove(available, {
        pickFromCandidates: (cands) =>
          pickSafeDirectAttacker(cands, ctx.view, ctx.playerId as string),
        pickPair: () => null,
      });
    case "useBlocker":
      if (inputSpec.type !== "selectCard") break;
      if (ctx.view.attackState?.redirectedByBlocker) {
        return { kind: "stuck", reason: "useBlocker: attack already redirected by blocker" };
      }
      return decisionFromMove(available, {
        pickFromCandidates: (cands) =>
          pickBlockerForAttack(cands, ctx.view, ctx.playerId as string, weights),
        pickPair: () => null,
      });
    case "callLegend":
    case "goSolo":
    case "resolveCardToPlay":
      // Generic: take the first available candidate via the shared mapper.
      return decisionFromMove(available, {
        pickFromCandidates: (cands) => cands[0] ?? null,
        pickPair: () => null,
      });
    case "activateAbility":
      if (inputSpec.type !== "selectAbility") break;
      return decisionFromMove(available, {
        pickFromCandidates: () => null,
        pickPair: () => null,
        pickAbility: (cands) => pickBestAbility(cands, ctx),
      });
    case "passPhase":
    case "concede":
    case "mulligan":
    case "keepHand":
    case "gainGig":
    case "resolveAttack":
    case "resolveCardToMove":
    case "resolveScry":
    case "resolveRevealDestination":
    case "resolveDiscardFromHand":
    case "resolveAdjustGig":
    case "resolveStealGigs":
    case "resolveTrigger":
    case "resolveEffectTarget":
    case "resolveCardTypeChoice":
      return decisionFromMove(available, {
        pickFromCandidates: (cands) => cands[0] ?? null,
        pickPair: () => null,
      });
    default:
      return assertNever(moveId, "MoveId in greedy.pickArgsFor");
  }
  return { kind: "stuck", reason: `greedy: unexpected inputSpec for ${moveId}` };
}

// ── Heuristics over the filtered view ────────────────────────────────────

function findCard(view: FilteredMatchView, instanceId: string): FilteredCardView | null {
  for (const player of Object.values(view.players)) {
    for (const cards of Object.values(player.zones)) {
      if (!Array.isArray(cards)) continue;
      const hit = cards.find((c) => c.instanceId === instanceId);
      if (hit) return hit;
    }
  }
  return null;
}

function cardStrategicValue(card: FilteredCardView | null): number {
  if (!card) return 0;
  const power = card.effectivePower ?? 0;
  const blocker =
    card.keywords.includes("blocker") || card.grantedRules.includes("blocker") ? 18 : 0;
  const immediateAttack =
    card.keywords.includes("adrenaline") || card.keywords.includes("goSolo") ? 8 : 0;
  const typeValue = card.type === "unit" ? 10 : card.type === "gear" ? 6 : 4;
  return power * 3 + blocker + immediateAttack + typeValue + card.triggerHints.length * 5;
}

function pickCardToSell(
  candidates: string[],
  view: FilteredMatchView,
  playerId: string,
): string | null {
  const available = view.players[playerId]?.availableEddies ?? 0;
  return (
    [...candidates].sort((a, b) => {
      const ac = findCard(view, a);
      const bc = findCard(view, b);
      const aPlayable = (ac?.cost ?? Number.POSITIVE_INFINITY) <= available ? 8 : 0;
      const bPlayable = (bc?.cost ?? Number.POSITIVE_INFINITY) <= available ? 8 : 0;
      const av = cardStrategicValue(ac) + aPlayable;
      const bv = cardStrategicValue(bc) + bPlayable;
      if (av !== bv) return av - bv;
      const aCost = ac?.cost ?? Number.POSITIVE_INFINITY;
      const bCost = bc?.cost ?? Number.POSITIVE_INFINITY;
      if (aCost !== bCost) return bCost - aCost;
      return a.localeCompare(b);
    })[0] ?? null
  );
}

const ABILITY_EFFECT_VALUES: Readonly<Record<string, number>> = {
  stealGig: 40,
  defeat: 30,
  playCard: 24,
  ready: 20,
  readyEddies: 18,
  draw: 16,
  discardFromHand: 15,
  attachCard: 14,
  modifyPower: 12,
  grantRule: 12,
  adjustGig: 10,
  moveCard: 10,
  scry: 8,
};

function pickBestAbility(candidates: AbilityCandidate[], ctx: DecisionContext) {
  const { ownGigCount, rivalGigCount } = getGigCounts(ctx);
  return (
    [...candidates].sort((a, b) => {
      const score = (candidate: AbilityCandidate) => {
        let value = candidate.effectHints.reduce(
          (total, effect) => total + (ABILITY_EFFECT_VALUES[effect] ?? 5),
          0,
        );
        if (ownGigCount >= 5 && candidate.effectHints.includes("stealGig")) value += 30;
        if (
          rivalGigCount >= 5 &&
          candidate.effectHints.some((e) => e === "defeat" || e === "ready")
        )
          value += 15;
        value -= candidate.eddieCost * 5;
        if (candidate.spendsCard) value -= 3;
        return value;
      };
      const av = score(a);
      const bv = score(b);
      if (av !== bv) return bv - av;
      if (a.cardId !== b.cardId) return a.cardId.localeCompare(b.cardId);
      return a.abilityIndex - b.abilityIndex;
    })[0] ?? null
  );
}

function pickWeakestCard(candidates: string[], view: FilteredMatchView): string | null {
  if (candidates.length === 0) return null;
  let best: { id: string; power: number; cost: number } | null = null;
  for (const id of candidates) {
    const card = findCard(view, id);
    const power = card?.effectivePower ?? Number.POSITIVE_INFINITY;
    const cost = card?.cost ?? Number.POSITIVE_INFINITY;
    if (
      !best ||
      power < best.power ||
      (power === best.power && cost < best.cost) ||
      (power === best.power && cost === best.cost && id < best.id)
    ) {
      best = { id, power, cost };
    }
  }
  return best?.id ?? candidates[0]!;
}

function pickStrongestAttacker(
  candidates: string[],
  view: FilteredMatchView,
  _playerId: string,
): string | null {
  if (candidates.length === 0) return null;
  let best: { id: string; power: number } | null = null;
  for (const id of candidates) {
    const card = findCard(view, id);
    const power = card?.effectivePower ?? 0;
    if (!best || power > best.power || (power === best.power && id < best.id)) {
      best = { id, power };
    }
  }
  return best?.id ?? candidates[0]!;
}

function pickSafeDirectAttacker(
  candidates: string[],
  view: FilteredMatchView,
  playerId: string,
): string | null {
  if (candidates.length === 0) return null;
  const requiredAttackers = mustAttackCandidates(candidates, view);
  if (requiredAttackers.length > 0) return pickStrongestAttacker(requiredAttackers, view, playerId);
  if (getRivalGigCount(view, playerId) === 0) return null;

  const rivalBlockers = getRivalReadyBlockers(view, playerId);
  const strongestBlockerPower = rivalBlockers.reduce(
    (max, card) => Math.max(max, card.effectivePower ?? 0),
    Number.NEGATIVE_INFINITY,
  );
  const safeCandidates =
    rivalBlockers.length === 0
      ? candidates
      : candidates.filter((id) => {
          const attacker = findCard(view, id);
          return (attacker?.effectivePower ?? 0) > strongestBlockerPower;
        });

  return pickStrongestAttacker(safeCandidates, view, playerId);
}

function getRivalGigCount(view: FilteredMatchView, playerId: string): number {
  for (const [pid, player] of Object.entries(view.players)) {
    if (pid !== playerId) return player.gigCount;
  }
  return 0;
}

function getOwnGigCount(view: FilteredMatchView, playerId: string): number {
  return view.players[playerId]?.gigCount ?? 0;
}

function getRivalPlayerId(view: FilteredMatchView, playerId: string): string | null {
  for (const pid of Object.keys(view.players)) {
    if (pid !== playerId) return pid;
  }
  return null;
}

function directStealAmountForAttacker(card: FilteredCardView, availableGigs: number): number {
  const power = card.effectivePower ?? 0;
  if (power <= 0 || availableGigs <= 0) return 0;
  const base = 1 + Math.floor(power / 10);
  const reduction = card.grantedRules.includes("stealsOneFewerGig") ? 1 : 0;
  return Math.min(Math.max(0, base - reduction), availableGigs);
}

function canDirectAttackRivalThisTurn(
  card: FilteredCardView,
  hasPlayedProgramThisTurn: boolean,
): boolean {
  if (card.spent || card.faceDown) return false;
  if (card.grantedRules.includes("cantAttack")) return false;
  if (card.grantedRules.includes("requiresProgramPlayedThisTurn") && !hasPlayedProgramThisTurn) {
    return false;
  }
  if (card.hasLag) {
    return (
      card.grantedRules.includes("adrenaline") ||
      card.grantedRules.includes("canAttackRivalOnPlayedTurn")
    );
  }
  return card.type === "unit" || card.keywords.includes("goSolo");
}

type BlockerOutcome = "survive" | "trade" | "chump";

interface BlockerCandidateScore {
  id: string;
  outcome: BlockerOutcome;
  power: number;
  cost: number;
  blockerTrigger: boolean;
}

function blockerOutcome(blockerPower: number, attackerPower: number): BlockerOutcome {
  if (blockerPower > attackerPower) return "survive";
  if (blockerPower === attackerPower) return "trade";
  return "chump";
}

function outcomeRank(outcome: BlockerOutcome): number {
  switch (outcome) {
    case "survive":
      return 0;
    case "trade":
      return 1;
    case "chump":
      return 2;
    default:
      return assertNever(outcome, "BlockerOutcome in outcomeRank");
  }
}

function attackerHasDirectStealTrigger(card: FilteredCardView, view: FilteredMatchView): boolean {
  if (card.triggerHints.includes("gigStolen")) return true;
  return card.attachedGearIds.some((gearId) => {
    const gear = findCard(view, gearId);
    return gear?.triggerHints.includes("gigStolen") === true;
  });
}

function blockerHasUseTrigger(card: FilteredCardView): boolean {
  return card.triggerHints.includes("blockerActivated");
}

function directAttackIsUrgent(
  attacker: FilteredCardView,
  view: FilteredMatchView,
  playerId: string,
  weights: GreedyWeights,
): boolean {
  const ownGigCount = getOwnGigCount(view, playerId);
  const rivalGigCount = getRivalGigCount(view, playerId);
  const stolen = directStealAmountForAttacker(attacker, ownGigCount);
  if (stolen <= 0) return false;
  if (stolen >= 2) return true;
  if (ownGigCount >= weights.ownNearWinThreshold) return true;
  if (rivalGigCount + stolen >= weights.rivalNearWinThreshold) return true;
  return attackerHasDirectStealTrigger(attacker, view);
}

function scoreBlockerCandidate(
  id: string,
  view: FilteredMatchView,
  attackerPower: number,
): BlockerCandidateScore | null {
  const card = findCard(view, id);
  if (!card) return null;
  return {
    id,
    outcome: blockerOutcome(card.effectivePower ?? 0, attackerPower),
    power: card.effectivePower ?? 0,
    cost: card.cost ?? Number.POSITIVE_INFINITY,
    blockerTrigger: blockerHasUseTrigger(card),
  };
}

function compareBlockerScores(a: BlockerCandidateScore, b: BlockerCandidateScore): number {
  const ar = outcomeRank(a.outcome);
  const br = outcomeRank(b.outcome);
  if (ar !== br) return ar - br;
  if (a.blockerTrigger !== b.blockerTrigger) return a.blockerTrigger ? -1 : 1;
  if (a.power !== b.power) return a.power - b.power;
  if (a.cost !== b.cost) return a.cost - b.cost;
  return a.id.localeCompare(b.id);
}

function pickDirectAttackBlocker(
  candidates: string[],
  view: FilteredMatchView,
  attacker: FilteredCardView,
  playerId: string,
  weights: GreedyWeights,
): string | null {
  const attackerPower = attacker.effectivePower ?? 0;
  const urgent = directAttackIsUrgent(attacker, view, playerId, weights);
  const scores = candidates
    .map((id) => scoreBlockerCandidate(id, view, attackerPower))
    .filter((score): score is BlockerCandidateScore => score !== null)
    .filter((score) => {
      if (score.outcome !== "chump") return true;
      if (!urgent) return false;
      return !shouldPreserveBlockerForLaterAttacker(
        score,
        view,
        playerId,
        attacker.instanceId,
        weights,
      );
    })
    .sort(compareBlockerScores);

  return scores[0]?.id ?? null;
}

function shouldPreserveBlockerForLaterAttacker(
  blocker: BlockerCandidateScore,
  view: FilteredMatchView,
  playerId: string,
  currentAttackerId: string,
  weights: GreedyWeights,
): boolean {
  const ownGigCount = getOwnGigCount(view, playerId);
  const rivalGigCount = getRivalGigCount(view, playerId);
  if (
    ownGigCount >= weights.ownNearWinThreshold ||
    rivalGigCount >= weights.rivalNearWinThreshold
  ) {
    return false;
  }

  const currentAttacker = findCard(view, currentAttackerId);
  const currentStolen = currentAttacker
    ? directStealAmountForAttacker(currentAttacker, ownGigCount)
    : 0;
  if (currentAttacker && attackerHasDirectStealTrigger(currentAttacker, view)) {
    return false;
  }
  const rivalPlayerId = getRivalPlayerId(view, playerId);
  if (!rivalPlayerId) return false;
  const rivalPlayedProgram =
    view.playedCardTypesThisTurn?.[rivalPlayerId]?.includes("program") === true;
  const laterAttackers = getRivalReadyUnits(view, playerId).filter((unit) => {
    return (
      unit.instanceId !== currentAttackerId &&
      canDirectAttackRivalThisTurn(unit, rivalPlayedProgram)
    );
  });
  const mustAttackers = laterAttackers.filter((unit) => unit.grantedRules.includes("mustAttack"));
  const eligibleAttackers = mustAttackers.length > 0 ? mustAttackers : laterAttackers;
  const laterAvailableGigs = Math.max(0, ownGigCount - currentStolen);

  return eligibleAttackers.some((unit) => {
    const unitPower = unit.effectivePower ?? 0;
    const laterStolen = directStealAmountForAttacker(unit, laterAvailableGigs);
    return blocker.power > unitPower && laterStolen > 0 && laterStolen >= currentStolen;
  });
}

function pickFightBlocker(
  candidates: string[],
  view: FilteredMatchView,
  attacker: FilteredCardView,
  defender: FilteredCardView,
): string | null {
  const attackerPower = attacker.effectivePower ?? 0;
  const defenderPower = defender.effectivePower ?? 0;
  if (defenderPower > attackerPower) return null;

  const defenderValue = defenderPower + (defender.cost ?? 0);
  const scores = candidates
    .map((id) => scoreBlockerCandidate(id, view, attackerPower))
    .filter((score): score is BlockerCandidateScore => {
      if (!score) return false;
      if (score.outcome !== "chump") return true;
      const blockerValue = score.power + (Number.isFinite(score.cost) ? score.cost : 0);
      return defenderValue > blockerValue;
    })
    .sort(compareBlockerScores);

  return scores[0]?.id ?? null;
}

function pickBlockerForAttack(
  candidates: string[],
  view: FilteredMatchView,
  playerId: string,
  weights: GreedyWeights,
): string | null {
  if (candidates.length === 0) return null;
  const attack = view.attackState;
  if (!attack || !attack.attackerId) return pickWeakestCard(candidates, view);

  const attacker = findCard(view, attack.attackerId);
  if (!attacker) return null;

  if (attack.kind === "direct") {
    return pickDirectAttackBlocker(candidates, view, attacker, playerId, weights);
  }

  if (attack.kind === "fight" && attack.defenderId) {
    const defender = findCard(view, attack.defenderId);
    if (!defender) return null;
    return pickFightBlocker(candidates, view, attacker, defender);
  }

  return null;
}

function pickFavourableFight(
  fromCandidates: string[],
  toCandidates: string[],
  view: FilteredMatchView,
  _playerId: string,
  minMargin: number,
): { from: string; to: string } | null {
  if (fromCandidates.length === 0 || toCandidates.length === 0) return null;
  const requiredAttackers = mustAttackCandidates(fromCandidates, view);
  const attackers = requiredAttackers.length > 0 ? requiredAttackers : fromCandidates;
  let best: { from: string; to: string; margin: number; score: number } | null = null;
  for (const from of attackers) {
    for (const to of toCandidates) {
      const fromCard = findCard(view, from);
      const toCard = findCard(view, to);
      const margin = (fromCard?.effectivePower ?? 0) - (toCard?.effectivePower ?? 0);
      if (requiredAttackers.length === 0 && margin < minMargin) continue;
      const targetValue = cardStrategicValue(toCard) + (toCard?.attachedGearIds.length ?? 0) * 8;
      const attackerCommitment = cardStrategicValue(fromCard);
      const score = targetValue * 10 - attackerCommitment + Math.min(margin, 5);
      if (
        !best ||
        score > best.score ||
        (score === best.score && `${from}:${to}` < `${best.from}:${best.to}`)
      ) {
        best = { from, to, margin, score };
      }
    }
  }
  if (!best) return null;
  return { from: best.from, to: best.to };
}

function mustAttackCandidates(candidates: string[], view: FilteredMatchView): string[] {
  return candidates.filter((id) => {
    const card = findCard(view, id);
    return card?.grantedRules.includes("mustAttack") === true;
  });
}

/**
 * Greedy `playCard` pick. Rival-aware:
 *
 * - If the rival has ready (un-spent) units on their field AND we have no
 *   ready blocker on our own field, prefer playing a card with the
 *   `blocker` keyword (priced first by `effectivePower`, then `cost`) so we
 *   actually have a react answer next turn.
 * - Otherwise, fall back to the regular "highest cost playable" pick.
 *
 * Gear always attaches to the highest-power friendly unit so the buff lands
 * on the strongest threat.
 */
function pickPlayCardForBoard(
  candidates: PlayCardCandidate[],
  view: FilteredMatchView,
  playerId: string,
): PlayCardPick | null {
  if (candidates.length === 0) return null;

  const needsBlocker = rivalHasUnansweredThreats(view, playerId);
  if (needsBlocker) {
    const blockerCard = pickBestBlockerCard(candidates, view);
    if (blockerCard) return resolveCandidate(blockerCard, view, candidates);
  }

  return pickHighestBoardValuePlayable(candidates, view, playerId);
}

function pickHighestBoardValuePlayable(
  candidates: PlayCardCandidate[],
  view: FilteredMatchView,
  playerId: string,
): PlayCardPick | null {
  const ownNearWin = getOwnGigCount(view, playerId) >= 5;
  const ranked = [...candidates].sort((a, b) => {
    const score = (candidate: PlayCardCandidate) => {
      const card = findCard(view, candidate.cardId);
      let value = cardStrategicValue(card) + (card?.cost ?? 0);
      if (
        ownNearWin &&
        (card?.keywords.includes("adrenaline") || card?.keywords.includes("goSolo"))
      ) {
        value += 20;
      }
      if (candidate.attachTargets?.length) {
        value += Math.max(
          ...candidate.attachTargets.map(
            (targetId) => findCard(view, targetId)?.effectivePower ?? 0,
          ),
        );
      }
      return value;
    };
    const av = score(a);
    const bv = score(b);
    if (av !== bv) return bv - av;
    return a.cardId.localeCompare(b.cardId);
  });
  return ranked[0] ? resolveCandidate(ranked[0], view, candidates) : null;
}

function rivalHasUnansweredThreats(view: FilteredMatchView, playerId: string): boolean {
  const rivalReady = getRivalReadyUnits(view, playerId);
  if (rivalReady.length === 0) return false;
  const ownReadyBlockers = getOwnReadyBlockers(view, playerId);
  return ownReadyBlockers.length === 0;
}

function getRivalReadyUnits(view: FilteredMatchView, playerId: string): FilteredCardView[] {
  const result: FilteredCardView[] = [];
  for (const [pid, player] of Object.entries(view.players)) {
    if (pid === playerId) continue;
    const field = player.zones.field;
    if (!Array.isArray(field)) continue;
    for (const card of field) {
      if (card.spent || card.faceDown) continue;
      if (card.type !== "unit" && !card.keywords.includes("goSolo")) continue;
      result.push(card);
    }
  }
  return result;
}

function getOwnReadyBlockers(view: FilteredMatchView, playerId: string): FilteredCardView[] {
  const player = view.players[playerId];
  if (!player) return [];
  const field = player.zones.field;
  if (!Array.isArray(field)) return [];
  return field.filter((card) => isReadyBlocker(card));
}

function getRivalReadyBlockers(view: FilteredMatchView, playerId: string): FilteredCardView[] {
  const result: FilteredCardView[] = [];
  for (const [pid, player] of Object.entries(view.players)) {
    if (pid === playerId) continue;
    const field = player.zones.field;
    if (!Array.isArray(field)) continue;
    result.push(...field.filter((card) => isReadyBlocker(card)));
  }
  return result;
}

function isReadyBlocker(card: FilteredCardView): boolean {
  return (
    card.type === "unit" &&
    !card.spent &&
    !card.faceDown &&
    (card.keywords.includes("blocker") || card.grantedRules.includes("blocker"))
  );
}

function pickBestBlockerCard(
  candidates: PlayCardCandidate[],
  view: FilteredMatchView,
): PlayCardCandidate | null {
  const blockers = candidates
    .map((c) => ({ cand: c, card: findCard(view, c.cardId) }))
    .filter(({ card }) => card?.keywords.includes("blocker"))
    .sort((a, b) => {
      const ap = a.card?.effectivePower ?? 0;
      const bp = b.card?.effectivePower ?? 0;
      if (ap !== bp) return bp - ap;
      const ac = a.card?.cost ?? 0;
      const bc = b.card?.cost ?? 0;
      if (ac !== bc) return bc - ac;
      return a.cand.cardId.localeCompare(b.cand.cardId);
    });
  return blockers[0]?.cand ?? null;
}

function resolveCandidate(
  candidate: PlayCardCandidate,
  view: FilteredMatchView,
  _all: PlayCardCandidate[],
): PlayCardPick | null {
  if (candidate.attachTargets === undefined) return { cardId: candidate.cardId };
  if (candidate.attachTargets.length === 0) return null;
  let bestTarget = candidate.attachTargets[0]!;
  let bestPower = -1;
  for (const targetId of candidate.attachTargets) {
    const targetCard = findCard(view, targetId);
    const power = targetCard?.effectivePower ?? 0;
    if (power > bestPower) {
      bestPower = power;
      bestTarget = targetId;
    }
  }
  return { cardId: candidate.cardId, attachToId: bestTarget };
}
