import type { PlayerId } from "../../types/branded.ts";
import type { CommandEnvelope } from "../../types/commands.ts";
import type { MoveId } from "../../moves/index.ts";
import type { FilteredCardView, FilteredMatchView } from "../../view/filter.ts";
import type { AvailableMove, ChoicePrompt, PlayerPrompt } from "../../view/player-prompt.ts";
import { runResolver } from "../ai-player.ts";
import { bindGreedyDeckProfile, greedyStrategy, isGreedyAIStrategy } from "../strategies/greedy.ts";
import {
  gearHostMatch,
  isCoreCardName,
  isPreferSpendUnit,
  preferredLegendHostNames,
  type DeckStrategyProfile,
} from "../deck-profile.ts";
import type {
  AIStrategy,
  DecisionContext,
  DecisionDiagnostics,
  EngineHandle,
  MoveDecision,
} from "../types.ts";
import { evaluateBoard } from "./evaluate-board.ts";
import { enumerateCandidateActions, enumerateChoiceActions } from "./shared.ts";
import { scoreActivatedAbility, scoreCardAbilitiesForPlay } from "../util/ability-value.ts";

export interface TacticalStrategyOptions {
  maxDepth?: number;
  maxNodes?: number;
  branchLimit?: number;
  fallbackStrategy?: AIStrategy;
  name?: string;
  abilityAware?: boolean;
  deckProfile?: DeckStrategyProfile;
}

/**
 * Tactical-family strategy. Exposes constructor options and the bound deck
 * profile so {@link withDeckProfile} can rebind without dropping search
 * settings (depth, ability-aware scoring, etc.).
 */
export interface TacticalAIStrategy extends AIStrategy {
  readonly tactical: true;
  readonly tacticalOptions: TacticalStrategyOptions;
  readonly deckProfile?: DeckStrategyProfile;
}

export function isTacticalAIStrategy(strategy: AIStrategy): strategy is TacticalAIStrategy {
  const candidate = strategy as Partial<TacticalAIStrategy>;
  return candidate.tactical === true && typeof candidate.tacticalOptions === "object";
}

interface TacticalScoringOptions {
  abilityAware: boolean;
}

interface SearchBudget {
  nodes: number;
  maxNodes: number;
  deepest: number;
  cutoffReason: DecisionDiagnostics["cutoffReason"];
}

interface ScoredAction {
  action: MoveDecision & { kind: "command" };
  score: number;
  abilityFit: number;
  child: EngineHandle | null;
}

const SEARCH_FAILURE_SCORE = 900_000;
const HIDDEN_OUTCOME_EFFECTS = new Set([
  "draw",
  "lookAt",
  "rerollGig",
  "revealTopCardAndModifyPowerByCost",
  "revealTopCardType",
  "rivalRevealChoice",
  "scry",
  "searchDeck",
  "sellFromDeck",
  "trashFromDeck",
]);
// Activated abilities whose only hidden-outcome hints reveal the top of the
// CONTROLLER'S OWN deck (e.g. Judy Álvarez: Nothing to Doubt). Their fork is
// deterministic, so scoring them from the simulated outcome does not model
// unknown information — the simulator observes the revealed card exactly as
// the activating player would. Product decision (2026-09-17): practice bots
// are allowed this self-deck top-card knowledge when weighing an activation;
// every other hidden-outcome effect keeps the pessimistic cutoff.
const SELF_DECK_REVEAL_EFFECT_HINTS = new Set(["trashFromDeck"]);
const PUBLIC_OPPONENT_MOVES: ReadonlySet<MoveId> = new Set([
  "attackUnit",
  "attackRival",
  "useBlocker",
  "goSolo",
  "passPhase",
  "gainGig",
  "resolveAttack",
  "activateAbility",
  "resolveAdjustGig",
  "resolveStealGigs",
  "resolveTrigger",
  "resolveEffectTarget",
  "resolveCardTypeChoice",
  "resolveChooseEffect",
  "resolveRedirectDefeat",
  "resolveSacrificialGear",
  "resolveFirstPlayer",
]);

export function createTacticalStrategy(options: TacticalStrategyOptions = {}): TacticalAIStrategy {
  const maxDepth = options.maxDepth ?? 3;
  const maxNodes = options.maxNodes ?? 48;
  const branchLimit = options.branchLimit ?? 12;
  const profile = options.deckProfile;
  const fallback =
    options.fallbackStrategy ??
    (profile ? bindGreedyDeckProfile(greedyStrategy, profile) : greedyStrategy);
  const scoring: TacticalScoringOptions = { abilityAware: options.abilityAware === true };

  const decide = (ctx: DecisionContext): MoveDecision => {
    if (!ctx.engine) return fallbackDecision(ctx, fallback);
    const actions = actionsForPrompt(ctx.prompt, ctx, fallback);
    if (actions.length === 0) return fallbackDecision(ctx, fallback);
    if (actions.length === 1) {
      return withDiagnostics(actions[0]!, {
        strategy: "tactical",
        candidateCount: 1,
        nodesEvaluated: 0,
        depthReached: 0,
        scoreGap: null,
        cutoffReason: "complete",
      });
    }

    const budget: SearchBudget = {
      nodes: 0,
      maxNodes,
      deepest: 0,
      cutoffReason: "complete",
    };
    const rootPlayerId = ctx.playerId;
    const scored = scoreRootActions(
      ctx.engine,
      rootPlayerId,
      actions,
      maxDepth,
      branchLimit,
      budget,
      fallback,
      scoring,
      profile,
    );
    if (scored.length === 0) return fallbackDecision(ctx, fallback);
    scored.sort(compareMaxScores);
    const best = scored[0]!;
    const runnerUp = scored[1];
    return withDiagnostics(best.action, {
      strategy: "tactical",
      candidateCount: actions.length,
      nodesEvaluated: budget.nodes,
      depthReached: budget.deepest,
      scoreGap: runnerUp ? best.score - runnerUp.score : null,
      cutoffReason: budget.cutoffReason,
    });
  };

  return {
    tactical: true,
    name: options.name ?? "tactical",
    tacticalOptions: options,
    deckProfile: profile,
    decideAction: decide,
    decideChoice: {
      scry: (_choice, ctx) => decide(ctx),
      revealDestination: (_choice, ctx) => decide(ctx),
      chooseTarget: (_choice, ctx) => decide(ctx),
      chooseEffect: (_choice, ctx) => decide(ctx),
      chooseTrigger: (_choice, ctx) => decide(ctx),
      chooseGigsToSteal: (_choice, ctx) => decide(ctx),
      chooseCardToPlay: (_choice, ctx) => decide(ctx),
      chooseCardToMove: (_choice, ctx) => decide(ctx),
      chooseCardType: (_choice, ctx) => decide(ctx),
      gainGig: (_choice, ctx) => decide(ctx),
      redirectDefeat: (_choice, ctx) => decide(ctx),
      chooseSacrificialGear: (_choice, ctx) => decide(ctx),
      chooseFirstPlayer: (_choice, ctx) => decide(ctx),
    },
  };
}

export const tacticalStrategy = createTacticalStrategy();
export const abilityAwareTacticalStrategy = createTacticalStrategy({
  name: "tactical-ability-aware",
  abilityAware: true,
});

function scoreRootActions(
  engine: EngineHandle,
  rootPlayerId: PlayerId,
  actions: Array<MoveDecision & { kind: "command" }>,
  maxDepth: number,
  branchLimit: number,
  budget: SearchBudget,
  fallback: AIStrategy,
  scoring: TacticalScoringOptions,
  profile: DeckStrategyProfile | undefined,
): ScoredAction[] {
  const ranked = rankActions(
    engine,
    rootPlayerId,
    rootPlayerId,
    actions,
    true,
    budget,
    scoring,
    profile,
  );
  const selected = ranked.slice(0, Math.max(branchLimit, Math.min(actions.length, 24)));
  const scored: ScoredAction[] = [];
  for (const { action, child } of selected) {
    if (!child) {
      scored.push({ action, score: -SEARCH_FAILURE_SCORE, abilityFit: 0, child: null });
      continue;
    }
    const before = engine.getFilteredView(rootPlayerId);
    const after = child.getFilteredView(rootPlayerId);
    const hiddenCutoff = hiddenInformationChanged(before, after, action, rootPlayerId);
    const score = hiddenCutoff
      ? hiddenCutoffScore(before, action, rootPlayerId, rootPlayerId, budget, profile)
      : search(
          child,
          rootPlayerId,
          maxDepth - 1,
          1,
          branchLimit,
          budget,
          fallback,
          scoring,
          profile,
        );
    scored.push({
      action,
      score,
      abilityFit: abilityAwarePriorAdjustment(action, before, rootPlayerId as string, scoring),
      child,
    });
  }
  return scored;
}

function search(
  engine: EngineHandle,
  rootPlayerId: PlayerId,
  depth: number,
  depthFromRoot: number,
  branchLimit: number,
  budget: SearchBudget,
  fallback: AIStrategy,
  scoring: TacticalScoringOptions,
  profile: DeckStrategyProfile | undefined,
): number {
  budget.deepest = Math.max(budget.deepest, depthFromRoot);
  const rootView = engine.getFilteredView(rootPlayerId);
  if (rootView.gameEnded) return evaluateBoard(rootView, rootPlayerId as string);
  if (depth <= 0) {
    if (budget.cutoffReason === "complete") budget.cutoffReason = "depth";
    return evaluateBoard(rootView, rootPlayerId as string);
  }
  if (budget.nodes >= budget.maxNodes) {
    budget.cutoffReason = "node-budget";
    return evaluateBoard(rootView, rootPlayerId as string);
  }

  const actor = whoActsNext(engine, rootPlayerId);
  if (!actor) return evaluateBoard(rootView, rootPlayerId as string);
  const prompt = engine.getPrompt(actor);
  if (actor !== rootPlayerId && prompt.choice && !isPublicOpponentChoice(prompt.choice, rootView)) {
    budget.cutoffReason = "hidden-information";
    return hiddenOpponentReplyScore(rootView, rootPlayerId, actor);
  }
  const ctx: DecisionContext = {
    view: engine.getFilteredView(actor),
    playerId: actor,
    prompt,
    rng: () => 0.5,
    engine,
  };
  const searchablePrompt = actor === rootPlayerId ? prompt : publicOpponentPrompt(prompt, rootView);
  const actions = actionsForPrompt(
    searchablePrompt,
    ctx,
    actor === rootPlayerId ? fallback : greedyStrategy,
  );
  if (actions.length === 0) {
    if (actor !== rootPlayerId) {
      budget.cutoffReason = "hidden-information";
      return hiddenOpponentReplyScore(rootView, rootPlayerId, actor);
    }
    return -SEARCH_FAILURE_SCORE;
  }

  if (actions.length === 1) {
    const action = actions[0]!;
    const before = engine.getFilteredView(rootPlayerId);
    const child = applyAction(engine, actor, action, budget);
    if (!child) return actor === rootPlayerId ? -SEARCH_FAILURE_SCORE : SEARCH_FAILURE_SCORE;
    const after = child.getFilteredView(rootPlayerId);
    return hiddenInformationChanged(before, after, action, actor)
      ? hiddenCutoffScore(before, action, rootPlayerId, actor, budget, profile)
      : search(
          child,
          rootPlayerId,
          depth,
          depthFromRoot + 1,
          branchLimit,
          budget,
          fallback,
          scoring,
          profile,
        );
  }

  const maximizing = actor === rootPlayerId;
  const ranked = rankActions(
    engine,
    rootPlayerId,
    actor,
    actions,
    maximizing,
    budget,
    scoring,
    profile,
  ).slice(0, branchLimit);
  const privateReplyPossible = !maximizing && possiblePrivateOpponentAction(rootView, actor);
  if (privateReplyPossible) budget.cutoffReason = "hidden-information";
  let best = maximizing
    ? Number.NEGATIVE_INFINITY
    : privateReplyPossible
      ? hiddenOpponentReplyScore(rootView, rootPlayerId, actor)
      : Number.POSITIVE_INFINITY;
  for (const { action, child } of ranked) {
    const before = engine.getFilteredView(rootPlayerId);
    if (!child) {
      const failure = maximizing ? -SEARCH_FAILURE_SCORE : SEARCH_FAILURE_SCORE;
      best = maximizing ? Math.max(best, failure) : Math.min(best, failure);
      continue;
    }
    const after = child.getFilteredView(rootPlayerId);
    const score = hiddenInformationChanged(before, after, action, actor)
      ? hiddenCutoffScore(before, action, rootPlayerId, actor, budget, profile)
      : search(
          child,
          rootPlayerId,
          depth - 1,
          depthFromRoot + 1,
          branchLimit,
          budget,
          fallback,
          scoring,
          profile,
        );
    best = maximizing ? Math.max(best, score) : Math.min(best, score);
  }
  return Number.isFinite(best) ? best : evaluateBoard(rootView, rootPlayerId as string);
}

function rankActions(
  engine: EngineHandle,
  rootPlayerId: PlayerId,
  actor: PlayerId,
  actions: Array<MoveDecision & { kind: "command" }>,
  maximizing: boolean,
  budget: SearchBudget,
  scoring: TacticalScoringOptions,
  profile: DeckStrategyProfile | undefined,
): ScoredAction[] {
  const before = engine.getFilteredView(rootPlayerId);
  const actorView = engine.getFilteredView(actor);
  const ranked: ScoredAction[] = [];
  for (const action of actions) {
    if (budget.nodes >= budget.maxNodes) {
      budget.cutoffReason = "node-budget";
      break;
    }
    budget.nodes += 1;
    const child = engine.fork();
    const result = child.processCommand(toCommand(action, `rank:${actionKey(action)}`), actor);
    const after = result.success ? child.getFilteredView(rootPlayerId) : before;
    const boardScore = hiddenInformationChanged(before, after, action, actor)
      ? evaluateBoard(before, rootPlayerId as string)
      : evaluateBoard(after, rootPlayerId as string);
    const score = result.success
      ? boardScore +
        (maximizing ? 1 : -1) *
          actionPrior(
            action,
            actorView,
            actor as string,
            actor === rootPlayerId ? profile : undefined,
          )
      : maximizing
        ? -SEARCH_FAILURE_SCORE
        : SEARCH_FAILURE_SCORE;
    ranked.push({
      action,
      score,
      abilityFit: abilityAwarePriorAdjustment(action, actorView, actor as string, scoring),
      child: result.success ? child : null,
    });
  }
  return ranked.sort(maximizing ? compareMaxScores : compareMinScores);
}

function applyAction(
  engine: EngineHandle,
  actor: PlayerId,
  action: MoveDecision & { kind: "command" },
  budget: SearchBudget,
): EngineHandle | null {
  budget.nodes += 1;
  const child = engine.fork();
  const result = child.processCommand(toCommand(action, `tactical:${budget.nodes}`), actor);
  return result.success ? child : null;
}

function actionsForPrompt(
  prompt: PlayerPrompt,
  ctx: DecisionContext,
  fallback: AIStrategy,
): Array<MoveDecision & { kind: "command" }> {
  if (prompt.status === "choice" && prompt.choice) {
    if (choiceCrossesHiddenInformation(prompt.choice.type)) {
      return fallbackChoice(prompt, ctx, fallback);
    }
    const expanded = enumerateChoiceActions(prompt.choice);
    return expanded.length > 0 ? expanded : fallbackChoice(prompt, ctx, fallback);
  }
  const profile = isGreedyAIStrategy(fallback) ? fallback.deckProfile : undefined;
  return applyMulliganPolicy(
    applyCombatSafetyPolicy(
      applyPreferSpendPolicy(
        applyGoSoloHoldPolicy(
          applyUninstalledCoreSellHold(
            applySellCorePolicy(
              applyGearHostPolicy(enumerateCandidateActions(prompt), ctx, profile),
              ctx,
              profile,
            ),
            ctx,
            profile,
          ),
          ctx,
          profile,
        ),
        ctx,
        profile,
      ),
      ctx,
      fallback,
    ),
    ctx,
    fallback,
  );
}

/**
 * When a deck profile names preferred Gear hosts and at least one is a legal
 * attach target, drop every other host for that Gear. Tactical search otherwise
 * scores a high-power Unit above a face-up Legend and installs Overwatch /
 * Sandevistan on the wrong body.
 */
function applyGearHostPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): Array<MoveDecision & { kind: "command" }> {
  if (!profile) return actions;
  const HOST_RANK: Record<ReturnType<typeof gearHostMatch>, number> = {
    preferred: 0,
    typed: 1,
    named: 2,
    none: 3,
  };
  const bestRank = new Map<string, number>();
  for (const action of actions) {
    if (action.move !== "playCard") continue;
    const gearId = stringArg(action.args?.cardId);
    const hostId = stringArg(action.args?.attachToId);
    if (!gearId || !hostId) continue;
    const rank =
      HOST_RANK[
        gearHostMatch(findCard(ctx.view, gearId)?.cardName, findCard(ctx.view, hostId), profile)
      ];
    const current = bestRank.get(gearId);
    if (current === undefined || rank < current) bestRank.set(gearId, rank);
  }
  if (bestRank.size === 0) return actions;
  return actions.filter((action) => {
    if (action.move !== "playCard") return true;
    const gearId = stringArg(action.args?.cardId);
    const hostId = stringArg(action.args?.attachToId);
    if (!gearId || !hostId || !bestRank.has(gearId)) return true;
    const rank =
      HOST_RANK[
        gearHostMatch(findCard(ctx.view, gearId)?.cardName, findCard(ctx.view, hostId), profile)
      ];
    return rank === bestRank.get(gearId);
  });
}

/**
 * Keep preferred Legend carriers in the Legend area until the gig race is
 * closing. Go Solo on Overwatch's Goro is the guide's "don't treat him as a
 * free extra Unit" failure.
 */
/**
 * Judy Nothing-to-Doubt (and any profiled Spend unit): if her Spend is legal,
 * do not attack — the reveal-and-play line is the deck's core. Closing the
 * gig race (≥5) still lets combat through.
 */
function applyPreferSpendPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): Array<MoveDecision & { kind: "command" }> {
  if (!profile?.preferSpendOverAttack?.length) return actions;
  const ownGigs = ctx.view.players[ctx.playerId as string]?.gigCount ?? 0;
  if (ownGigs >= 5) return actions;
  const canSpend = actions.some((action) => {
    if (action.move !== "activateAbility") return false;
    const card = findCard(ctx.view, stringArg(action.args?.cardId));
    return isPreferSpendUnit(card, profile);
  });
  if (!canSpend) return actions;
  const spendOnly = actions.filter((action) => {
    if (action.move !== "activateAbility") return false;
    const card = findCard(ctx.view, stringArg(action.args?.cardId));
    return isPreferSpendUnit(card, profile);
  });
  return spendOnly.length > 0 ? spendOnly : actions;
}

function applyGoSoloHoldPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): Array<MoveDecision & { kind: "command" }> {
  const hold = preferredLegendHostNames(profile);
  if (hold.size === 0) return actions;
  const ownGigs = ctx.view.players[ctx.playerId as string]?.gigCount ?? 0;
  if (ownGigs >= 5) return actions;
  const kept = actions.filter((action) => {
    if (action.move !== "goSolo") return true;
    const card = findCard(ctx.view, stringArg(action.args?.cardId));
    return !card?.cardName || !hold.has(card.cardName);
  });
  return kept.length > 0 ? kept : actions;
}

/** Don't sell an engine piece while a non-core sellable is still in hand. */
function applySellCorePolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): Array<MoveDecision & { kind: "command" }> {
  if (!profile || profile.coreCards.length === 0) return actions;
  const hasNonCoreSale = actions.some((action) => {
    if (action.move !== "sellCard") return false;
    const card = findCard(ctx.view, stringArg(action.args?.cardId));
    return !isCoreCardName(card?.cardName, profile);
  });
  if (!hasNonCoreSale) return actions;
  return actions.filter((action) => {
    if (action.move !== "sellCard") return true;
    const card = findCard(ctx.view, stringArg(action.args?.cardId));
    return !isCoreCardName(card?.cardName, profile);
  });
}

/**
 * Keep the first copy of a core engine card. Extra copies may sell once one
 * is already in play; selling the only Overwatch to fund a 2-cost play is
 * the guide's "don't sell the shot" failure.
 */
function applyUninstalledCoreSellHold(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): Array<MoveDecision & { kind: "command" }> {
  if (!profile || profile.coreCards.length === 0) return actions;
  const kept = actions.filter((action) => {
    if (action.move !== "sellCard") return true;
    const card = findCard(ctx.view, stringArg(action.args?.cardId));
    if (!isCoreCardName(card?.cardName, profile) || !card?.cardName) return true;
    return countInPlay(ctx.view, ctx.playerId as string, card.cardName) > 0;
  });
  return kept.length > 0 ? kept : actions;
}

function countInPlay(view: FilteredMatchView, playerId: string, cardName: string): number {
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

function applyMulliganPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  fallback: AIStrategy,
): Array<MoveDecision & { kind: "command" }> {
  if (!actions.some((action) => action.move === "mulligan")) return actions;
  const decision = fallback.decideAction(ctx);
  if (decision.kind === "command" && decision.move === "mulligan") {
    return actions.filter((action) => action.move === "mulligan");
  }
  return actions.filter((action) => action.move !== "mulligan");
}

function applyCombatSafetyPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  fallback: AIStrategy,
): Array<MoveDecision & { kind: "command" }> {
  let filtered = filterUnsafeFights(actions, ctx.view);
  filtered = filterUnsafeDirectAttacks(filtered, ctx.view, ctx.playerId as string);

  if (filtered.some((action) => action.move === "useBlocker")) {
    const policyDecision = fallback.decideAction(ctx);
    if (policyDecision.kind === "command" && policyDecision.move === "useBlocker") {
      const blockerId = stringArg(policyDecision.args?.blockerId);
      return filtered.filter(
        (action) => action.move === "useBlocker" && stringArg(action.args?.blockerId) === blockerId,
      );
    }
    filtered = filtered.filter((action) => action.move !== "useBlocker");
  }

  return filtered;
}

function filterUnsafeFights(
  actions: Array<MoveDecision & { kind: "command" }>,
  view: FilteredMatchView,
): Array<MoveDecision & { kind: "command" }> {
  const fights = actions.filter((action) => action.move === "attackUnit");
  if (fights.length === 0) return actions;
  const requiredAttackerIds = new Set(
    fights
      .map((action) => stringArg(action.args?.attackerId))
      .filter((id) => findCard(view, id)?.grantedRules.includes("mustAttack") === true),
  );
  return actions.filter((action) => {
    if (action.move !== "attackUnit") return true;
    const attackerId = stringArg(action.args?.attackerId);
    if (requiredAttackerIds.size > 0) return requiredAttackerIds.has(attackerId);
    const attacker = findCard(view, attackerId);
    const defender = findCard(view, stringArg(action.args?.defenderId));
    return (attacker?.effectivePower ?? 0) > (defender?.effectivePower ?? 0);
  });
}

function filterUnsafeDirectAttacks(
  actions: Array<MoveDecision & { kind: "command" }>,
  view: FilteredMatchView,
  actorId: string,
): Array<MoveDecision & { kind: "command" }> {
  const attacks = actions.filter((action) => action.move === "attackRival");
  if (attacks.length === 0) return actions;
  const rival = Object.entries(view.players).find(([playerId]) => playerId !== actorId)?.[1];
  const rivalGigs = rival?.gigCount ?? 0;
  const rivalBlockers = rival ? readyBlockers(rival.zones.field) : [];
  const strongestBlocker = rivalBlockers.reduce(
    (power, blocker) => Math.max(power, blocker.effectivePower),
    Number.NEGATIVE_INFINITY,
  );
  const required = attacks.filter((action) =>
    findCard(view, stringArg(action.args?.attackerId))?.grantedRules.includes("mustAttack"),
  );
  const safe =
    required.length > 0
      ? required
      : attacks.filter((action) => {
          const attacker = findCard(view, stringArg(action.args?.attackerId));
          return rivalGigs > 0 && (attacker?.effectivePower ?? 0) > strongestBlocker;
        });
  const selected = [...safe].sort((a, b) => {
    const aId = stringArg(a.args?.attackerId);
    const bId = stringArg(b.args?.attackerId);
    const powerDelta =
      (findCard(view, bId)?.effectivePower ?? 0) - (findCard(view, aId)?.effectivePower ?? 0);
    return powerDelta !== 0 ? powerDelta : aId.localeCompare(bId);
  })[0];
  return actions.filter((action) => action.move !== "attackRival" || action === selected);
}

function readyBlockers(zone: FilteredCardView[] | number | undefined): FilteredCardView[] {
  if (!Array.isArray(zone)) return [];
  return zone.filter(
    (card) =>
      card.type === "unit" &&
      !card.faceDown &&
      !card.spent &&
      (card.keywords.includes("blocker") || card.grantedRules.includes("blocker")),
  );
}

function fallbackChoice(
  prompt: PlayerPrompt,
  ctx: DecisionContext,
  fallback: AIStrategy,
): Array<MoveDecision & { kind: "command" }> {
  if (!prompt.choice) return [];
  const decision = runResolver(prompt.choice, fallback, ctx);
  return decision.kind === "command" ? [decision] : [];
}

function fallbackDecision(ctx: DecisionContext, fallback: AIStrategy): MoveDecision {
  if (ctx.prompt.status === "choice" && ctx.prompt.choice) {
    return runResolver(ctx.prompt.choice, fallback, ctx);
  }
  return fallback.decideAction(ctx);
}

function whoActsNext(engine: EngineHandle, viewer: PlayerId): PlayerId | null {
  const view = engine.getFilteredView(viewer);
  if (view.gameEnded) return null;
  const playerIds = Object.keys(view.players) as PlayerId[];
  const ordered = [...playerIds].sort((a, b) => {
    const aActive = (a as string) === view.activePlayerId ? 0 : 1;
    const bActive = (b as string) === view.activePlayerId ? 0 : 1;
    return aActive - bActive;
  });
  for (const playerId of ordered) {
    const prompt = engine.getPrompt(playerId);
    if (prompt.status === "action" || prompt.status === "choice") return playerId;
  }
  return null;
}

function hiddenInformationChanged(
  before: FilteredMatchView,
  after: FilteredMatchView,
  action: MoveDecision & { kind: "command" },
  actor: PlayerId,
): boolean {
  if (action.move === "mulligan" || action.move === "gainGig") return true;
  if (promptChoiceCrossesHiddenInformation(after.prompt)) return true;
  const selfDeckReveal = isSelfDeckRevealActivation(before.prompt, action);
  if (actionUsesHiddenEffectHint(before.prompt, action) && !selfDeckReveal) return true;
  if (action.move !== "resolveAdjustGig" && gigValuesChanged(before, after)) return true;
  for (const playerId of Object.keys(before.players)) {
    const beforePlayer = before.players[playerId];
    const afterPlayer = after.players[playerId];
    if (!beforePlayer || !afterPlayer) continue;
    if (zoneCount(beforePlayer.zones.deck) === zoneCount(afterPlayer.zones.deck)) continue;
    // A self-deck reveal activation is scored from its deterministic fork and
    // its owner sees the revealed card; the owner's own deck shrinking is not
    // unknown information. Any other deck delta stays hidden.
    if (selfDeckReveal && playerId === actor) continue;
    return true;
  }
  return false;
}

/**
 * True when the action activates an ability whose hidden-outcome hints are all
 * self-deck top reveals ({@link SELF_DECK_REVEAL_EFFECT_HINTS}); such forks are
 * safe to score from their simulated outcome.
 */
function isSelfDeckRevealActivation(
  prompt: PlayerPrompt,
  action: MoveDecision & { kind: "command" },
): boolean {
  if (action.move !== "activateAbility") return false;
  const move = prompt.availableMoves.find((candidate) => candidate.moveId === "activateAbility");
  if (move?.inputSpec.type !== "selectAbility") return false;
  const cardId = stringArg(action.args?.cardId);
  const abilityIndex = numberArg(action.args?.abilityIndex);
  const candidate = move.inputSpec.candidates.find(
    (ability) => ability.cardId === cardId && ability.abilityIndex === abilityIndex,
  );
  if (!candidate) return false;
  return candidate.effectHints.every(
    (hint) => !HIDDEN_OUTCOME_EFFECTS.has(hint) || SELF_DECK_REVEAL_EFFECT_HINTS.has(hint),
  );
}

function publicOpponentPrompt(prompt: PlayerPrompt, rootView: FilteredMatchView): PlayerPrompt {
  if (prompt.status === "choice") return prompt;
  const visibleIds = visibleCardIds(rootView);
  return {
    ...prompt,
    availableMoves: prompt.availableMoves.filter(
      (move) => PUBLIC_OPPONENT_MOVES.has(move.moveId) && moveUsesVisibleInputs(move, visibleIds),
    ),
  };
}

function moveUsesVisibleInputs(move: AvailableMove, visibleIds: ReadonlySet<string>): boolean {
  switch (move.inputSpec.type) {
    case "none":
      return true;
    case "selectCard":
      return move.inputSpec.candidates.every((id) => visibleIds.has(id));
    case "selectPair":
      return (
        move.inputSpec.fromCandidates.every((id) => visibleIds.has(id)) &&
        move.inputSpec.toCandidates.every((id) => visibleIds.has(id))
      );
    case "selectAbility":
      return move.inputSpec.candidates.every((candidate) => visibleIds.has(candidate.cardId));
    case "playCard":
      return false;
  }
}

function isPublicOpponentChoice(choice: ChoicePrompt, rootView: FilteredMatchView): boolean {
  const visibleIds = visibleCardIds(rootView);
  switch (choice.type) {
    case "scry":
    case "revealDestination":
    case "chooseEffect":
    case "chooseCardToPlay":
      return false;
    case "chooseTarget":
      if (
        choice.payload.type === "discardFromHand" ||
        choice.payload.targetPurpose === "playCard"
      ) {
        return false;
      }
      return (choice.payload.eligibleIds ?? []).every((id) => visibleIds.has(id));
    case "chooseTrigger":
      return choice.payload.options.every((option) => visibleIds.has(option.sourceCardId));
    case "chooseGigsToSteal":
      return choice.payload.eligibleDice.every((die) => visibleIds.has(die.dieId));
    case "preventGigSteal":
      return false;
    case "chooseCardToMove":
      return choice.payload.cardIds.every((id) => visibleIds.has(id));
    case "chooseCardType":
      return false;
    case "gainGig":
      return false;
    case "redirectDefeat":
      return (
        visibleIds.has(choice.payload.protectedCardId) &&
        visibleIds.has(choice.payload.replacementCardId)
      );
    case "chooseSacrificialGear":
      return choice.payload.gearIds.every((id) => visibleIds.has(id));
    case "chooseFirstPlayer":
      return true;
  }
}

function visibleCardIds(view: FilteredMatchView): Set<string> {
  const ids = new Set<string>();
  for (const player of Object.values(view.players)) {
    for (const zone of Object.values(player.zones)) {
      if (!Array.isArray(zone)) continue;
      for (const card of zone) ids.add(card.instanceId);
    }
  }
  return ids;
}

function possiblePrivateOpponentAction(view: FilteredMatchView, actor: PlayerId): boolean {
  const player = view.players[actor as string];
  if (!player) return false;
  if (view.gamePhase !== "main" || view.activePlayerId !== (actor as string)) return false;
  return zoneCount(player.zones.hand) > 0 || faceDownLegendCount(player.zones.legendArea) > 0;
}

function hiddenOpponentReplyScore(
  view: FilteredMatchView,
  rootPlayerId: PlayerId,
  actor: PlayerId,
): number {
  const player = view.players[actor as string];
  if (!player) return evaluateBoard(view, rootPlayerId as string);
  const handSize = Math.min(5, zoneCount(player.zones.hand));
  const resourcePressure = Math.min(6, player.availableEddies);
  return evaluateBoard(view, rootPlayerId as string) - 16 - handSize * 4 - resourcePressure * 2;
}

function hiddenCutoffScore(
  before: FilteredMatchView,
  action: MoveDecision & { kind: "command" },
  rootPlayerId: PlayerId,
  actor: PlayerId,
  budget: SearchBudget,
  profile: DeckStrategyProfile | undefined,
): number {
  budget.cutoffReason = "hidden-information";
  return (
    evaluateBoard(before, rootPlayerId as string) +
    (actor === rootPlayerId ? 1 : -1) *
      actionPrior(action, before, actor as string, actor === rootPlayerId ? profile : undefined)
  );
}

const HOST_PRIOR: Record<ReturnType<typeof gearHostMatch>, number> = {
  preferred: 12,
  typed: 6,
  named: 2,
  none: 0,
};

function actionPrior(
  action: MoveDecision & { kind: "command" },
  view: FilteredMatchView,
  actorId: string,
  profile?: DeckStrategyProfile,
): number {
  switch (action.move) {
    case "concede":
      return -SEARCH_FAILURE_SCORE;
    case "passPhase":
      return -12;
    case "attackRival": {
      const attacker = findCard(view, stringArg(action.args?.attackerId));
      const rivalGigs =
        Object.entries(view.players).find(([id]) => id !== actorId)?.[1].gigCount ?? 0;
      const power = attacker?.effectivePower ?? 0;
      return Math.min(rivalGigs, power > 0 ? 1 + Math.floor(power / 10) : 0) * 40;
    }
    case "attackUnit":
      return 12;
    case "activateAbility": {
      const card = findCard(view, stringArg(action.args?.cardId));
      return isPreferSpendUnit(card, profile) ? 50 : 8;
    }
    case "playCard": {
      const card = findCard(view, stringArg(action.args?.cardId));
      if (!card) return 0;
      let prior = Math.max(0, card.effectivePower) * 2 + (card.cost ?? 0);
      if (isCoreCardName(card.cardName, profile)) prior += 8;
      const host = findCard(view, stringArg(action.args?.attachToId));
      prior += HOST_PRIOR[gearHostMatch(card.cardName, host, profile)];
      return prior;
    }
    case "sellCard": {
      const card = findCard(view, stringArg(action.args?.cardId));
      return isCoreCardName(card?.cardName, profile) ? -20 : 4;
    }
    default:
      return 0;
  }
}

function abilityAwarePriorAdjustment(
  action: MoveDecision & { kind: "command" },
  view: FilteredMatchView,
  actorId: string,
  scoring: TacticalScoringOptions,
): number {
  if (!scoring.abilityAware) return 0;
  if (action.move === "playCard") {
    const card = findCard(view, stringArg(action.args?.cardId));
    return card
      ? scoreCardAbilitiesForPlay(card, view, actorId, {
          attachToId: stringArg(action.args?.attachToId) || undefined,
        })
      : 0;
  }
  if (action.move === "activateAbility") {
    const cardId = stringArg(action.args?.cardId);
    const abilityIndex = numberArg(action.args?.abilityIndex);
    if (abilityIndex === null) return 0;
    const candidate = abilityCandidate(view, cardId, abilityIndex);
    return (
      scoreActivatedAbility(findCard(view, cardId), abilityIndex, view, actorId) -
      (candidate?.eddieCost ?? 0) * 5 -
      (candidate?.spendsCard ? 3 : 0)
    );
  }
  return 0;
}

function abilityCandidate(view: FilteredMatchView, cardId: string, abilityIndex: number) {
  const move = view.prompt.availableMoves.find(
    (candidate) => candidate.moveId === "activateAbility",
  );
  if (move?.inputSpec.type !== "selectAbility") return undefined;
  return move.inputSpec.candidates.find(
    (candidate) => candidate.cardId === cardId && candidate.abilityIndex === abilityIndex,
  );
}

function choiceCrossesHiddenInformation(choiceType: string): boolean {
  return (
    choiceType === "scry" ||
    choiceType === "revealDestination" ||
    choiceType === "chooseCardType" ||
    choiceType === "gainGig"
  );
}

function promptChoiceCrossesHiddenInformation(prompt: PlayerPrompt): boolean {
  return (
    prompt.status === "choice" &&
    prompt.choice !== null &&
    choiceCrossesHiddenInformation(prompt.choice.type)
  );
}

function actionUsesHiddenEffectHint(
  prompt: PlayerPrompt,
  action: MoveDecision & { kind: "command" },
): boolean {
  if (action.move === "activateAbility") {
    const move = prompt.availableMoves.find((candidate) => candidate.moveId === "activateAbility");
    if (move?.inputSpec.type !== "selectAbility") return true;
    const cardId = stringArg(action.args?.cardId);
    const abilityIndex = numberArg(action.args?.abilityIndex);
    const candidate = move.inputSpec.candidates.find(
      (ability) => ability.cardId === cardId && ability.abilityIndex === abilityIndex,
    );
    return !candidate || candidate.effectHints.some((hint) => HIDDEN_OUTCOME_EFFECTS.has(hint));
  }
  if (action.move === "resolveEffectTarget" && prompt.choice?.type === "chooseTarget") {
    return effectContainsHiddenOutcome(prompt.choice.payload.effect);
  }
  return action.move === "resolveCardTypeChoice";
}

function effectContainsHiddenOutcome(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(effectContainsHiddenOutcome);
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (typeof record.effect === "string" && HIDDEN_OUTCOME_EFFECTS.has(record.effect)) return true;
  return Object.values(record).some(effectContainsHiddenOutcome);
}

function gigValuesChanged(before: FilteredMatchView, after: FilteredMatchView): boolean {
  const beforeValues = gigValues(before);
  const afterValues = gigValues(after);
  for (const [dieId, value] of beforeValues) {
    const next = afterValues.get(dieId);
    if (next !== undefined && next !== value) return true;
  }
  return false;
}

function gigValues(view: FilteredMatchView): Map<string, number> {
  const values = new Map<string, number>();
  for (const player of Object.values(view.players)) {
    const gigs = player.zones.gigArea;
    if (!Array.isArray(gigs)) continue;
    for (const gig of gigs) values.set(gig.instanceId, gig.effectivePower);
  }
  return values;
}

function findCard(view: FilteredMatchView, instanceId: string): FilteredCardView | null {
  for (const player of Object.values(view.players)) {
    for (const zone of Object.values(player.zones)) {
      if (!Array.isArray(zone)) continue;
      const card = zone.find((candidate) => candidate.instanceId === instanceId);
      if (card) return card;
    }
  }
  return null;
}

function stringArg(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberArg(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

function zoneCount(zone: FilteredCardView[] | number | undefined): number {
  return Array.isArray(zone) ? zone.length : (zone ?? 0);
}

function faceDownLegendCount(zone: FilteredCardView[] | number | undefined): number {
  return Array.isArray(zone) ? zone.filter((card) => card.faceDown).length : 0;
}

function toCommand(action: MoveDecision & { kind: "command" }, commandID: string): CommandEnvelope {
  return {
    commandID,
    move: action.move,
    input: action.args ? { args: action.args } : undefined,
  };
}

function withDiagnostics(
  action: MoveDecision & { kind: "command" },
  diagnostics: DecisionDiagnostics,
): MoveDecision {
  return { ...action, diagnostics };
}

function compareMaxScores(a: ScoredAction, b: ScoredAction): number {
  if (a.score !== b.score) return b.score - a.score;
  if (a.abilityFit !== b.abilityFit) return b.abilityFit - a.abilityFit;
  return actionKey(a.action).localeCompare(actionKey(b.action));
}

function compareMinScores(a: ScoredAction, b: ScoredAction): number {
  if (a.score !== b.score) return a.score - b.score;
  if (a.abilityFit !== b.abilityFit) return b.abilityFit - a.abilityFit;
  return actionKey(a.action).localeCompare(actionKey(b.action));
}

function actionKey(action: MoveDecision & { kind: "command" }): string {
  return `${action.move}:${stableStringify(action.args ?? {})}`;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}
