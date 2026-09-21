import type { AIStrategy, DecisionContext, MoveDecision } from "../types.ts";
import type {
  AbilityCandidate,
  AvailableMove,
  PlayCardCandidate,
} from "../../view/player-prompt.ts";
import type { FilteredCardView, FilteredMatchView } from "../../view/filter.ts";
import type { MoveId } from "../../moves/index.ts";
import {
  gearHostMatch,
  isPreferSpendUnit,
  preferredLegendHostNames,
  type DeckStrategyProfile,
} from "../deck-profile.ts";
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

/**
 * A greedy-family strategy. Exposes its weight set and optional deck profile
 * so callers can rebind a different profile without reconstructing weights
 * from scratch (`withDeckProfile`).
 */
export interface GreedyAIStrategy extends AIStrategy {
  /** The weight set this strategy was constructed with (before profile overrides). */
  readonly greedyWeights: GreedyWeights;
  readonly deckProfile?: DeckStrategyProfile;
}

export function isGreedyAIStrategy(strategy: AIStrategy): strategy is GreedyAIStrategy {
  const candidate = strategy as Partial<GreedyAIStrategy>;
  return typeof candidate.greedyWeights === "object" && candidate.greedyWeights !== null;
}

/**
 * Bind a deck strategy profile onto a greedy-family strategy. Tactical and
 * other search strategies are wrapped by {@link withDeckProfile} in
 * `bind-profile.ts` so this helper stays cycle-free with the search layer.
 */
export function bindGreedyDeckProfile(
  strategy: AIStrategy,
  profile: DeckStrategyProfile,
): AIStrategy {
  if (!isGreedyAIStrategy(strategy)) return strategy;
  if (strategy.deckProfile === profile) return strategy;
  return createGreedyStrategy(strategy.greedyWeights, strategy.name, profile);
}

/**
 * @deprecated Use {@link bindGreedyDeckProfile} or the dispatcher
 * `withDeckProfile` from `automation/bind-profile.ts`. Kept as an alias so
 * greedy-only call sites keep working.
 */
export function withDeckProfile(strategy: AIStrategy, profile: DeckStrategyProfile): AIStrategy {
  return bindGreedyDeckProfile(strategy, profile);
}

/**
 * Layer profile weight overrides over the base weights. Scalar overrides
 * replace; priority overrides merge per move so a profile can re-rank just
 * the moves its pacing cares about.
 */
const DEVELOP_FIRST_DEFAULT_PRIORITY: Partial<Record<MoveId, number>> = {
  playCard: 10,
  callLegend: 9,
  attackRival: 8,
  attackUnit: 7,
};

function mergeProfileWeights(
  weights: GreedyWeights,
  profile: DeckStrategyProfile | undefined,
): GreedyWeights {
  const merged = cloneWeights(weights);
  if (profile?.pacing === "develop-first") {
    merged.defaultPriority = { ...merged.defaultPriority, ...DEVELOP_FIRST_DEFAULT_PRIORITY };
  }
  const overrides = profile?.weights;
  if (!overrides) return merged;
  if (overrides.ownNearWinThreshold !== undefined)
    merged.ownNearWinThreshold = overrides.ownNearWinThreshold;
  if (overrides.rivalNearWinThreshold !== undefined)
    merged.rivalNearWinThreshold = overrides.rivalNearWinThreshold;
  if (overrides.mulliganMinCheapCards !== undefined)
    merged.mulliganMinCheapCards = overrides.mulliganMinCheapCards;
  if (overrides.mulliganCheapCostThreshold !== undefined)
    merged.mulliganCheapCostThreshold = overrides.mulliganCheapCostThreshold;
  if (overrides.mulliganMinSellable !== undefined)
    merged.mulliganMinSellable = overrides.mulliganMinSellable;
  if (overrides.fightMinMargin !== undefined) merged.fightMinMargin = overrides.fightMinMargin;
  if (overrides.defaultPriority)
    merged.defaultPriority = { ...merged.defaultPriority, ...overrides.defaultPriority };
  if (overrides.ownNearWinPriority)
    merged.ownNearWinPriority = { ...merged.ownNearWinPriority, ...overrides.ownNearWinPriority };
  if (overrides.rivalNearWinPriority)
    merged.rivalNearWinPriority = {
      ...merged.rivalNearWinPriority,
      ...overrides.rivalNearWinPriority,
    };
  return merged;
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
 * Build a greedy strategy with a custom weight set and optional deck
 * strategy profile. The default export `greedyStrategy` is
 * `createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS)`.
 */
export function createGreedyStrategy(
  weights: GreedyWeights = DEFAULT_GREEDY_WEIGHTS,
  name = "greedy",
  profile?: DeckStrategyProfile,
): GreedyAIStrategy {
  const strategyWeights = mergeProfileWeights(weights, profile);
  return {
    name,
    greedyWeights: weights,
    deckProfile: profile,
    decideAction(ctx) {
      const mulliganMove = ctx.prompt.availableMoves.find((m) => m.moveId === "mulligan");
      const wantsMulligan = shouldMulligan(ctx, strategyWeights, profile);
      if (mulliganMove && wantsMulligan) {
        return { kind: "command", move: "mulligan" };
      }

      const moveOrder = priorityOrder(ctx, strategyWeights, profile);
      for (const moveId of moveOrder) {
        if (moveId === "mulligan" && !wantsMulligan) continue;
        const available = ctx.prompt.availableMoves.find((m) => m.moveId === moveId);
        if (!available) continue;
        const decision = pickArgsFor(available, ctx, strategyWeights, profile);
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
 * Generic (no profile):
 *   - Keep if at least 2 cards cost ≤ 2 (we can deploy on turn 1-2 with the
 *     1-eddie/turn pacing) AND the hand has at least 1 sellable card (the
 *     primary eddie ramp in alpha).
 *
 * Deck-aware (with a profile): development means cheap *Units* (a hand of
 * cheap Programs with no board is the classic brick), a named engine piece
 * relieves `engineRelief` slots of the curve requirement, and a congestion
 * veto bounces hands holding too many copies of expensive payoffs before the
 * deck can deploy them.
 */
export function shouldMulligan(
  ctx: DecisionContext,
  weights: GreedyWeights = DEFAULT_GREEDY_WEIGHTS,
  profile?: DeckStrategyProfile,
): boolean {
  const hand = getOwnHand(ctx);
  if (hand.length === 0) return false;
  const tuning = profile?.mulligan;
  if (!tuning) {
    const cheap = hand.filter(
      (c) => (c.cost ?? Number.POSITIVE_INFINITY) <= weights.mulliganCheapCostThreshold,
    ).length;
    const sellable = hand.filter((c) => c.hasSellTag).length;
    return cheap < weights.mulliganMinCheapCards || sellable < weights.mulliganMinSellable;
  }

  const visible = hand.filter((c) => c.cardName !== null);
  const sellable = visible.filter((c) => c.hasSellTag).length;
  const minSellable = tuning.minSellable ?? weights.mulliganMinSellable;
  if (sellable < minSellable) return true;

  const congestionNames = tuning.congestionNames ?? [];
  const congestionMin = tuning.congestionMinCopies ?? 0;
  if (congestionMin > 0 && congestionNames.length > 0) {
    const congestion = visible.reduce(
      (total, card) => (congestionNames.includes(card.cardName!) ? total + 1 : total),
      0,
    );
    if (congestion >= congestionMin) return true;
  }

  const cheapUnitCost = tuning.cheapUnitCost ?? weights.mulliganCheapCostThreshold;
  const cheapUnits = visible.filter(
    (c) => c.type === "unit" && (c.cost ?? Number.POSITIVE_INFINITY) <= cheapUnitCost,
  ).length;
  const minCheapUnits = tuning.minCheapUnits ?? weights.mulliganMinCheapCards;
  const engineNames = tuning.engineNames ?? [];
  const engineHit = engineNames.some((name) => visible.some((c) => c.cardName === name));
  const curveNeed = Math.max(0, minCheapUnits - (engineHit ? (tuning.engineRelief ?? 0) : 0));
  return cheapUnits < curveNeed;
}

function getOwnHand(ctx: DecisionContext): FilteredCardView[] {
  const player = ctx.view.players?.[ctx.playerId as string];
  if (!player) return [];
  const handZone = player.zones.hand;
  if (!Array.isArray(handZone)) return [];
  return handZone;
}

function preferSpendAbilityAvailable(
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): boolean {
  if (!profile?.preferSpendOverAttack?.length) return false;
  const move = ctx.prompt.availableMoves.find(
    (candidate) => candidate.moveId === "activateAbility",
  );
  if (move?.inputSpec.type !== "selectAbility") return false;
  return move.inputSpec.candidates.some((candidate) =>
    isPreferSpendUnit(findCard(ctx.view, candidate.cardId), profile),
  );
}

function priorityOrder(
  ctx: DecisionContext,
  weights: GreedyWeights,
  profile?: DeckStrategyProfile,
): MoveId[] {
  const { ownGigCount, rivalGigCount } = getGigCounts(ctx);
  const ownNearWin = ownGigCount >= weights.ownNearWinThreshold;
  const rivalNearWin = rivalGigCount >= weights.rivalNearWinThreshold;

  const map = ownNearWin
    ? weights.ownNearWinPriority
    : rivalNearWin
      ? weights.rivalNearWinPriority
      : weights.defaultPriority;
  const ordered = orderFromPriority(map, ctx.prompt.availableMoves);
  if (ownGigCount < 5 && preferSpendAbilityAvailable(ctx, profile)) {
    return ["activateAbility", ...ordered.filter((id) => id !== "activateAbility")];
  }
  return ordered;
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
  profile?: DeckStrategyProfile,
): MoveDecision {
  const { moveId, inputSpec } = available;
  switch (moveId) {
    case "playCard":
      if (inputSpec.type !== "playCard") break;
      return decisionFromMove(available, {
        pickFromCandidates: () => null,
        pickPair: () => null,
        pickPlayCard: (cands) =>
          pickPlayCardForBoard(cands, ctx.view, ctx.playerId as string, profile),
      });
    case "sellCard":
      if (inputSpec.type !== "selectCard") break;
      return decisionFromMove(available, {
        pickFromCandidates: (cands) =>
          pickCardToSell(cands, ctx.view, ctx.playerId as string, profile),
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
          pickBlockerForAttack(cands, ctx.view, ctx.playerId as string, weights, profile),
        pickPair: () => null,
      });
    case "callLegend":
    case "resolveCardToPlay":
      // Generic: take the first available candidate via the shared mapper.
      return decisionFromMove(available, {
        pickFromCandidates: (cands) => cands[0] ?? null,
        pickPair: () => null,
      });
    case "goSolo":
      if (inputSpec.type !== "selectCard") break;
      return decisionFromMove(available, {
        pickFromCandidates: (cands) => pickGoSoloCandidate(cands, ctx, weights, profile),
        pickPair: () => null,
      });
    case "activateAbility":
      if (inputSpec.type !== "selectAbility") break;
      return decisionFromMove(available, {
        pickFromCandidates: () => null,
        pickPair: () => null,
        pickAbility: (cands) => pickBestAbility(cands, ctx, profile),
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
    case "resolvePreventGigSteal":
    case "resolveTrigger":
    case "resolveEffectTarget":
    case "resolveCardTypeChoice":
    case "resolveChooseEffect":
    case "resolveRedirectDefeat":
    case "resolveSacrificialGear":
    case "resolveFirstPlayer":
      return decisionFromMove(available, {
        pickFromCandidates: (cands) => cands[0] ?? null,
        pickPair: () => null,
      });
    case "cancelPendingResolution":
      return { kind: "stuck", reason: "cancelPendingResolution is a human escape hatch" };
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

/**
 * Play-order bonus for a deck profile's core cards (engines and payoffs).
 * Sized to break near-ties between comparable plays — big enough that an
 * engine piece beats an equally-priced generic card, small enough that it
 * never outranks actual board development (a playable Unit outvalues a
 * cheap Program even with the bonus).
 */
const CORE_PLAY_BONUS = 6;

function isCoreCard(card: FilteredCardView | null, coreCards: readonly string[] | undefined) {
  if (!coreCards || coreCards.length === 0 || card === null) return false;
  return card.cardName !== null && coreCards.includes(card.cardName);
}

function countNamedInPlay(
  view: FilteredMatchView,
  playerId: string,
  cardName: string | null | undefined,
): number {
  if (!cardName) return 0;
  const player = view.players[playerId];
  if (!player) return 0;
  let total = 0;
  for (const zone of [player.zones.field, player.zones.legendArea]) {
    if (!Array.isArray(zone)) continue;
    for (const card of zone) {
      if (card.cardName === cardName) total += 1;
    }
  }
  return total;
}

function pickCardToSell(
  candidates: string[],
  view: FilteredMatchView,
  playerId: string,
  profile?: DeckStrategyProfile,
): string | null {
  const available = view.players[playerId]?.availableEddies ?? 0;
  // Deck protection: never volunteer a core card for cash unless the engine
  // offers nothing else sellable — a strategy dies when its payoff is sold.
  const protectedCandidates = candidates.filter(
    (id) => !isCoreCard(findCard(view, id), profile?.coreCards),
  );
  const extraCore = candidates.filter((id) => {
    const card = findCard(view, id);
    return (
      isCoreCard(card, profile?.coreCards) && countNamedInPlay(view, playerId, card?.cardName) > 0
    );
  });
  const pool =
    protectedCandidates.length > 0 ? protectedCandidates : extraCore.length > 0 ? extraCore : null;
  if (!pool) return null;
  return (
    [...pool].sort((a, b) => {
      const ac = findCard(view, a);
      const bc = findCard(view, b);
      const aPlayable = (ac?.cost ?? Number.POSITIVE_INFINITY) <= available ? 8 : 0;
      const bPlayable = (bc?.cost ?? Number.POSITIVE_INFINITY) <= available ? 8 : 0;
      const av = cardStrategicValue(ac) + aPlayable;
      const bv = cardStrategicValue(bc) + bPlayable;
      if (av !== bv) return av - bv;
      const aCost = ac?.cost ?? Number.POSITIVE_INFINITY;
      const bCost = bc?.cost ?? Number.POSITIVE_INFINITY;
      // Same eddies, same strategic value: sell the cheaper card and keep
      // the expensive payoff in hand.
      if (aCost !== bCost) return aCost - bCost;
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

function pickBestAbility(
  candidates: AbilityCandidate[],
  ctx: DecisionContext,
  profile?: DeckStrategyProfile,
) {
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
        const card = findCard(ctx.view, candidate.cardId);
        if (isPreferSpendUnit(card, profile)) value += 40;
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

function pickGoSoloCandidate(
  candidates: string[],
  ctx: DecisionContext,
  weights: GreedyWeights,
  profile?: DeckStrategyProfile,
): string | null {
  const hold = preferredLegendHostNames(profile);
  const ownGigs = getOwnGigCount(ctx.view, ctx.playerId as string);
  const allowed =
    ownGigs >= weights.ownNearWinThreshold || hold.size === 0
      ? candidates
      : candidates.filter((id) => {
          const name = findCard(ctx.view, id)?.cardName;
          return !name || !hold.has(name);
        });
  return allowed[0] ?? null;
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
  profile?: DeckStrategyProfile,
): string | null {
  const attackerPower = attacker.effectivePower ?? 0;
  const urgent = directAttackIsUrgent(attacker, view, playerId, weights);
  // A deck profile can lower the deny-steal bar: trade a cheap body to stop
  // even a 1-Gig direct attack (control decks vs gig-race aggro).
  const blockStealsAtLeast = Math.min(profile?.blockDirectStealsAtLeast ?? 2, 2);
  const stealWorthBlocking =
    directStealAmountForAttacker(attacker, getOwnGigCount(view, playerId)) >= blockStealsAtLeast;
  const scores = candidates
    .map((id) => scoreBlockerCandidate(id, view, attackerPower))
    .filter((score): score is BlockerCandidateScore => score !== null)
    .filter((score) => {
      if (score.outcome !== "chump") return true;
      if (!urgent && !stealWorthBlocking) return false;
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
  profile?: DeckStrategyProfile,
): string | null {
  if (candidates.length === 0) return null;
  const attack = view.attackState;
  if (!attack || !attack.attackerId) return pickWeakestCard(candidates, view);

  const attacker = findCard(view, attack.attackerId);
  if (!attacker) return null;

  if (attack.kind === "direct") {
    return pickDirectAttackBlocker(candidates, view, attacker, playerId, weights, profile);
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
 * - Otherwise, fall back to the regular "highest board value playable" pick,
 *   which gives a deck profile's core cards a bonus so the strategy's engine
 *   comes online in time instead of idling in hand.
 *
 * Gear attaches to the profile's preferred host for that Gear when one is
 * on the board (e.g. Overwatch onto its named carrier), else to the
 * highest-power friendly unit.
 */
function pickPlayCardForBoard(
  candidates: PlayCardCandidate[],
  view: FilteredMatchView,
  playerId: string,
  profile?: DeckStrategyProfile,
): PlayCardPick | null {
  if (candidates.length === 0) return null;

  const needsBlocker = rivalHasUnansweredThreats(view, playerId);
  if (needsBlocker) {
    const blockerCard = pickBestBlockerCard(candidates, view);
    if (blockerCard) return resolveCandidate(blockerCard, view, candidates, profile);
  }

  return pickHighestBoardValuePlayable(candidates, view, playerId, profile);
}

function pickHighestBoardValuePlayable(
  candidates: PlayCardCandidate[],
  view: FilteredMatchView,
  playerId: string,
  profile?: DeckStrategyProfile,
): PlayCardPick | null {
  const ownNearWin = getOwnGigCount(view, playerId) >= 5;
  const ranked = [...candidates].sort((a, b) => {
    const score = (candidate: PlayCardCandidate) => {
      const card = findCard(view, candidate.cardId);
      let value = cardStrategicValue(card) + (card?.cost ?? 0);
      if (isCoreCard(card, profile?.coreCards)) value += CORE_PLAY_BONUS;
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
  return ranked[0] ? resolveCandidate(ranked[0], view, candidates, profile) : null;
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
  profile?: DeckStrategyProfile,
): PlayCardPick | null {
  if (candidate.attachTargets === undefined) return { cardId: candidate.cardId };
  if (candidate.attachTargets.length === 0) return null;
  const attachToId = pickAttachTarget(candidate.attachTargets, view, candidate.cardId, profile);
  return attachToId ? { cardId: candidate.cardId, attachToId } : null;
}

const HOST_MATCH_RANK: Record<ReturnType<typeof gearHostMatch>, number> = {
  preferred: 0,
  typed: 1,
  named: 2,
  none: 3,
};

function pickAttachTarget(
  targets: readonly string[],
  view: FilteredMatchView,
  gearId: string,
  profile?: DeckStrategyProfile,
): string | null {
  if (targets.length === 0) return null;
  const gearName = findCard(view, gearId)?.cardName;
  const preferredHosts =
    gearName !== null && gearName !== undefined ? profile?.gearHosts?.[gearName] : undefined;
  return (
    [...targets].sort((a, b) => {
      const ac = findCard(view, a);
      const bc = findCard(view, b);
      const aMatch = HOST_MATCH_RANK[gearHostMatch(gearName, ac, profile)];
      const bMatch = HOST_MATCH_RANK[gearHostMatch(gearName, bc, profile)];
      if (aMatch !== bMatch) return aMatch - bMatch;
      const aIdx =
        ac?.cardName && preferredHosts
          ? preferredHosts.indexOf(ac.cardName)
          : Number.MAX_SAFE_INTEGER;
      const bIdx =
        bc?.cardName && preferredHosts
          ? preferredHosts.indexOf(bc.cardName)
          : Number.MAX_SAFE_INTEGER;
      const aNamed = aIdx >= 0 ? aIdx : Number.MAX_SAFE_INTEGER;
      const bNamed = bIdx >= 0 ? bIdx : Number.MAX_SAFE_INTEGER;
      if (aNamed !== bNamed) return aNamed - bNamed;
      const aPower = ac?.effectivePower ?? 0;
      const bPower = bc?.effectivePower ?? 0;
      if (aPower !== bPower) return bPower - aPower;
      return a.localeCompare(b);
    })[0] ?? null
  );
}
