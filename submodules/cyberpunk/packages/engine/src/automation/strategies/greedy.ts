import type { AIStrategy, DecisionContext, MoveDecision } from "../types.ts";
import type { AvailableMove, PlayCardCandidate } from "../../view/player-prompt.ts";
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
        pickFromCandidates: (cands) => pickLowestCost(cands, ctx.view, ctx.playerId as string),
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
      // Pick the cheapest, lowest-power ready blocker so we don't waste a
      // strong unit on a redirect. Ties broken by id for determinism.
      return decisionFromMove(available, {
        pickFromCandidates: (cands) => pickWeakestBlocker(cands, ctx.view, ctx.playerId as string),
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
      // Greedy default: take the first activatable ability. Real cost/effect
      // weighting can replace this once specific ability ids matter.
      return decisionFromMove(available, {
        pickFromCandidates: () => null,
        pickPair: () => null,
        pickAbility: (cands) => cands[0] ?? null,
      });
    case "passPhase":
    case "concede":
    case "mulligan":
    case "keepHand":
    case "gainGig":
    case "resolveAttack":
    case "resolveCardToMove":
    case "resolveSearchDeck":
    case "resolveDiscardFromHand":
    case "resolveAdjustGig":
    case "resolveStealGigs":
    case "resolveTrigger":
    case "resolveEffectTarget":
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

function pickHighestCost(
  candidates: string[],
  view: FilteredMatchView,
  _playerId: string,
): string | null {
  if (candidates.length === 0) return null;
  let best: { id: string; cost: number } | null = null;
  for (const id of candidates) {
    const card = findCard(view, id);
    const cost = card?.cost ?? -1;
    if (!best || cost > best.cost || (cost === best.cost && id < best.id)) {
      best = { id, cost };
    }
  }
  return best?.id ?? candidates[0]!;
}

function pickLowestCost(
  candidates: string[],
  view: FilteredMatchView,
  _playerId: string,
): string | null {
  if (candidates.length === 0) return null;
  let best: { id: string; cost: number } | null = null;
  for (const id of candidates) {
    const card = findCard(view, id);
    const cost = card?.cost ?? Number.POSITIVE_INFINITY;
    if (!best || cost < best.cost || (cost === best.cost && id < best.id)) {
      best = { id, cost };
    }
  }
  return best?.id ?? candidates[0]!;
}

function pickWeakestBlocker(
  candidates: string[],
  view: FilteredMatchView,
  _playerId: string,
): string | null {
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

function pickFavourableFight(
  fromCandidates: string[],
  toCandidates: string[],
  view: FilteredMatchView,
  _playerId: string,
  minMargin: number,
): { from: string; to: string } | null {
  if (fromCandidates.length === 0 || toCandidates.length === 0) return null;
  let best: { from: string; to: string; margin: number } | null = null;
  for (const from of fromCandidates) {
    for (const to of toCandidates) {
      const fromCard = findCard(view, from);
      const toCard = findCard(view, to);
      const margin = (fromCard?.effectivePower ?? 0) - (toCard?.effectivePower ?? 0);
      if (!best || margin > best.margin) {
        best = { from, to, margin };
      }
    }
  }
  if (!best || best.margin < minMargin) return null;
  return { from: best.from, to: best.to };
}

/**
 * Greedy `playCard` pick. Rival-aware:
 *
 * - If the rival has ready (un-spent) units on their field AND we have no
 *   ready blocker on our own field, prefer playing a card with the
 *   `blocker` keyword (priced first by `effectivePower`, then `cost`) so we
 *   actually have a defensive answer next turn.
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

  return pickHighestCostPlayable(candidates, view, playerId);
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
      if (card.type !== "unit") continue;
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

function pickHighestCostPlayable(
  candidates: PlayCardCandidate[],
  view: FilteredMatchView,
  _playerId: string,
): PlayCardPick | null {
  const cardIds = candidates.map((c) => c.cardId);
  const cardId = pickHighestCost(cardIds, view, _playerId);
  if (!cardId) return null;
  const candidate = candidates.find((c) => c.cardId === cardId);
  if (!candidate) return null;
  return resolveCandidate(candidate, view, candidates);
}
