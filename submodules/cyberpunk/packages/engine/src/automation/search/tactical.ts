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
import { semanticViewHash } from "../public-view-hash.ts";
import { evaluateBoard } from "./evaluate-board.ts";
import { evaluateLateGigRace, isLateGigRace } from "./gig-race.ts";
import { enumerateCandidateActions, enumerateChoiceActions, passPhaseAction } from "./shared.ts";
import {
  getAbilityGameStage,
  scoreActivatedAbility,
  scoreCardAbilitiesForPlay,
  scoreReadyOnPlayAbilities,
} from "../util/ability-value.ts";
import { hasReadyUnitAdvantage } from "../util/board-presence.ts";
import { bestGigsToSteal } from "../util/gig-steal-plan.ts";

export interface TacticalStrategyOptions {
  maxDepth?: number;
  maxNodes?: number;
  branchLimit?: number;
  fallbackStrategy?: AIStrategy;
  name?: string;
  abilityAware?: boolean;
  deckProfile?: DeckStrategyProfile;
  /**
   * Named heuristic lessons to turn off. Shipped behavior keeps every lesson
   * on; the bench harness builds a baseline seat by naming the lesson under
   * test. Names: "safe-steal", "remove-targets", "gear-power", "legend-gear".
   */
  disabledHeuristics?: readonly string[];
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
  disabled: ReadonlySet<string>;
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
  const scoring: TacticalScoringOptions = {
    abilityAware: options.abilityAware === true,
    disabled: new Set(options.disabledHeuristics ?? []),
  };

  const decide = (ctx: DecisionContext, stallDepth = 0): MoveDecision => {
    if (!ctx.engine) return fallbackDecision(ctx, fallback);
    const actions = actionsForPrompt(ctx.prompt, ctx, fallback, scoring);
    if (actions.length === 0) {
      // Policies may legally veto every candidate (a curve line excluding an
      // attack the combat mandate kept, for example). The safe terminal
      // action is passing — re-rolling through the greedy fallback would
      // resurrect exactly the move the policies removed.
      const pass = passPhaseAction(ctx.prompt);
      if (pass) {
        return withDiagnostics(pass, {
          strategy: "tactical",
          candidateCount: 0,
          nodesEvaluated: 0,
          depthReached: 0,
          scoreGap: null,
          cutoffReason: "complete",
        });
      }
      return fallbackDecision(ctx, fallback);
    }
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
    const committed = committedActions(ctx, scored, stallDepth);
    const best = committed[0] ?? scored[0]!;
    const runnerUp = committed[1];
    return withDiagnostics(best.action, {
      strategy: "tactical",
      candidateCount: actions.length,
      nodesEvaluated: budget.nodes,
      depthReached: budget.deepest,
      scoreGap: runnerUp ? best.score - runnerUp.score : null,
      cutoffReason: budget.cutoffReason,
    });
  };

  /**
   * Drop a line the same chooser would immediately undo back onto this public
   * board. Alt's replay pays nothing until a trash program is chosen, so
   * activate-then-decline hashes identical to the action prompt and the runner
   * records repeatedState. Search can still rank that activation above passing
   * the turn, because the decline sits inside a shallower horizon than the
   * choice that actually takes it.
   */
  function committedActions(
    ctx: DecisionContext,
    scored: ScoredAction[],
    stallDepth: number,
  ): ScoredAction[] {
    if (stallDepth > 2) return scored.slice(0, 2);
    const kept: ScoredAction[] = [];
    for (const entry of scored) {
      if (followUpRestoresBoard(ctx, entry, stallDepth)) continue;
      kept.push(entry);
      if (kept.length === 2) break;
    }
    return kept;
  }

  function followUpRestoresBoard(
    ctx: DecisionContext,
    entry: ScoredAction,
    stallDepth: number,
  ): boolean {
    if (!ctx.engine || !entry.child) return false;
    const before = semanticViewHash(ctx.view);
    const opened = semanticViewHash(entry.child.getFilteredView(ctx.playerId));
    const actor = whoActsNext(entry.child, ctx.playerId);
    // A rival reaction is part of the line even when a scripted view has not
    // moved yet. Only our own continuation can decline back onto this board.
    if (!actor || actor !== ctx.playerId) return false;
    const prompt = entry.child.getPrompt(actor);
    if (prompt.status === "action") return opened === before;
    if (prompt.status !== "choice" || stallDepth >= 2) return opened === before;
    // A pending replay can change the public hash before any cost is paid.
    // Only activations need that second look; a play that already changed the
    // board is not the decline loop.
    if (opened !== before && entry.action.move !== "activateAbility") return false;
    const follow = decide(
      {
        view: entry.child.getFilteredView(actor),
        playerId: actor,
        prompt,
        rng: ctx.rng,
        engine: entry.child,
      },
      stallDepth + 1,
    );
    if (follow.kind !== "command") return true;
    const resolved = applyAction(entry.child, actor, follow, {
      nodes: 0,
      maxNodes: 1,
      deepest: 0,
      cutoffReason: "complete",
    });
    if (!resolved) return true;
    // The choice itself can hash differently (a pending replay is public) and
    // the decline still lands on the board we just left.
    return semanticViewHash(resolved.getFilteredView(ctx.playerId)) === before;
  }

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
  const rootView = engine.getFilteredView(rootPlayerId);
  if (isLateGigRace(rootView)) {
    selected.sort(
      (a, b) =>
        lateSearchPriority(b.action, rootView, rootPlayerId, profile, scoring) -
        lateSearchPriority(a.action, rootView, rootPlayerId, profile, scoring),
    );
  }
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
      ? hiddenCutoffScore(before, action, rootPlayerId, rootPlayerId, budget, profile, scoring)
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
          [semanticViewHash(before)],
          true,
        );
    scored.push({
      action,
      score:
        after.gameEnded || score <= STALL_SCORE
          ? score
          : score + strategicActionBonus(action, before, after, rootPlayerId as string),
      abilityFit: abilityAwarePriorAdjustment(action, before, rootPlayerId as string, scoring),
      child,
    });
  }
  return scored;
}

/** A bounded preference for a ready on-play Unit or removal that took effect. */
function strategicActionBonus(
  action: MoveDecision & { kind: "command" },
  before: FilteredMatchView,
  after: FilteredMatchView,
  actorId: string,
): number {
  if (action.move !== "playCard" && action.move !== "activateAbility") return 0;
  const card = findCard(before, stringArg(action.args?.cardId));
  let bonus = 0;
  if (action.move === "playCard" && card?.type === "unit") {
    const field = after.players[actorId]?.zones.field;
    if (Array.isArray(field) && field.some((unit) => unit.instanceId === card.instanceId)) {
      bonus = Math.min(28, scoreReadyOnPlayAbilities(card, before, actorId));
    }
  }

  const rivalBefore = Object.entries(before.players)
    .filter(([id]) => id !== actorId)
    .flatMap(([, player]) => (Array.isArray(player.zones.field) ? player.zones.field : []))
    .filter((unit) => unit.type === "unit" && !unit.faceDown);
  const rivalAfter = new Map(
    Object.entries(after.players)
      .filter(([id]) => id !== actorId)
      .flatMap(([, player]) => (Array.isArray(player.zones.field) ? player.zones.field : []))
      .map((unit) => [unit.instanceId, unit]),
  );
  const hardRemoval = rivalBefore.some((unit) => !rivalAfter.has(unit.instanceId));
  const softRemoval = rivalBefore.some((unit) => {
    const next = rivalAfter.get(unit.instanceId);
    return (
      next &&
      !unit.spent &&
      !unit.grantedRules.includes("cantAttack") &&
      (next.spent || next.grantedRules.includes("cantAttack"))
    );
  });
  const stage = getAbilityGameStage(before);
  const cost = action.move === "playCard" ? (card?.effectiveCost ?? card?.cost ?? 0) : 0;
  if (hardRemoval) bonus += stage === "early" ? Math.max(0, 30 - cost * 7) : 32;
  else if (softRemoval && stage === "late") bonus += 30;
  return Math.min(50, bonus);
}

/**
 * Worse than a lost game ({@link evaluateBoard} uses ±1_000_000). The runner
 * concedes a repeated public board as repeatedState, so a line that walks
 * back onto a board it already left must lose to every real ending.
 */
const STALL_SCORE = -1_000_001;

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
  ancestors: readonly string[],
  enteredByRoot: boolean,
): number {
  budget.deepest = Math.max(budget.deepest, depthFromRoot);
  const rootView = engine.getFilteredView(rootPlayerId);
  const hash = semanticViewHash(rootView);
  const actorNow = whoActsNext(engine, rootPlayerId);
  const backOnAnActionPrompt = !actorNow || engine.getPrompt(actorNow).status !== "choice";
  // Opening a choice does not change the public board. Returning to our own
  // earlier action prompt is a declined activation. Cutting the search off
  // while that choice is still open is the same stall: the line never left
  // the board. A rival reaction on an unchanged view is not, because a real
  // attack has already spent the attacker before that prompt exists.
  const ownUnchangedBoard = enteredByRoot && ancestors.includes(hash) && actorNow === rootPlayerId;
  if (ownUnchangedBoard && backOnAnActionPrompt) return STALL_SCORE;
  if (rootView.gameEnded) {
    const terminal = evaluateBoard(rootView, rootPlayerId as string);
    // Take a confirmed win now rather than an equally winning longer line.
    return terminal - Math.sign(terminal) * depthFromRoot;
  }
  if (depth <= 0) {
    if (budget.cutoffReason === "complete") budget.cutoffReason = "depth";
    if (ownUnchangedBoard) return STALL_SCORE;
    return evaluateBoard(rootView, rootPlayerId as string);
  }
  if (budget.nodes >= budget.maxNodes) {
    budget.cutoffReason = "node-budget";
    if (ownUnchangedBoard) return STALL_SCORE;
    return evaluateBoard(rootView, rootPlayerId as string);
  }

  const nextAncestors = [...ancestors, hash];
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
    scoring,
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
      ? hiddenCutoffScore(before, action, rootPlayerId, actor, budget, profile, scoring)
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
          nextAncestors,
          actor === rootPlayerId,
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
      ? hiddenCutoffScore(before, action, rootPlayerId, actor, budget, profile, scoring)
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
          nextAncestors,
          actor === rootPlayerId,
        );
    best = maximizing ? Math.max(best, score) : Math.min(best, score);
  }
  return Number.isFinite(best) ? best : evaluateBoard(rootView, rootPlayerId as string);
}

function lateSearchPriority(
  action: MoveDecision & { kind: "command" },
  view: FilteredMatchView,
  actor: PlayerId,
  profile: DeckStrategyProfile | undefined,
  scoring: TacticalScoringOptions,
): number {
  return action.move === "passPhase"
    ? 1_000_000
    : actionPrior(action, view, actor as string, profile, scoring);
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
  // A crowded board can exhaust the budget on Unit-target pairs alone. Check
  // the turn boundary first (it can win immediately), then high-value steals.
  // These are search priorities only; engine outcomes still choose the move.
  const ordered = isLateGigRace(actorView)
    ? [...actions].sort(
        (a, b) =>
          lateSearchPriority(b, actorView, actor, profile, scoring) -
          lateSearchPriority(a, actorView, actor, profile, scoring),
      )
    : actions;
  // Leave at least half of the remaining budget for replies and resolutions.
  // Otherwise a large target list leaves every attack at its declaration step.
  const rankingLimit = isLateGigRace(actorView)
    ? Math.min(24, Math.max(1, Math.floor((budget.maxNodes - budget.nodes) / 2)))
    : ordered.length;
  for (const action of ordered.slice(0, rankingLimit)) {
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
            scoring,
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
  scoring: TacticalScoringOptions,
): Array<MoveDecision & { kind: "command" }> {
  if (prompt.status === "choice" && prompt.choice) {
    if (prompt.choice.type === "chooseGigsToSteal") {
      const { eligibleDice, count } = prompt.choice.payload;
      const dieIds = bestGigsToSteal(ctx.view, ctx.playerId as string, eligibleDice, count);
      if (dieIds) return [{ kind: "command", move: "resolveStealGigs", args: { dieIds } }];
    }
    if (choiceCrossesHiddenInformation(prompt.choice.type)) {
      return fallbackChoice(prompt, ctx, fallback);
    }
    const expanded = expandAtomicGigAdjust(enumerateChoiceActions(prompt.choice), ctx);
    const profile = isGreedyAIStrategy(fallback) ? fallback.deckProfile : undefined;
    const lined = applyPlayLinePolicy(
      expanded.length > 0 ? expanded : fallbackChoice(prompt, ctx, fallback),
      ctx,
      profile,
    );
    return lined.length > 0 ? lined : fallbackChoice(prompt, ctx, fallback);
  }
  const profile = isGreedyAIStrategy(fallback) ? fallback.deckProfile : undefined;
  const enumerated = enumerateCandidateActions(prompt);
  // Towerfall and Les Élémens are core cards and also the prompt's spare sells.
  // The uninstalled-core hold would drop that sell, and the curve scorer still
  // counts it as a legal spare the bot passed on.
  const openingSell = curveOpeningSells(enumerated, ctx, profile);
  if (openingSell) return openingSell;
  // Apply the deck's sequencing constraints before generic combat preferences.
  // Otherwise a mandatory steal can discard the setup/pass action that the
  // deck policy needs and force a fallback that ignores that policy.
  let actions = applyGearHostPolicy(enumerated, ctx, profile, scoring);
  actions = applyPlayLinePolicy(actions, ctx, profile);
  actions = applySellCorePolicy(actions, ctx, profile);
  actions = applyUninstalledCoreSellHold(actions, ctx, profile);
  actions = applyGoSoloHoldPolicy(actions, ctx, profile);
  actions = applyPreferSpendPolicy(actions, ctx, profile);
  actions = applyMulliganPolicy(actions, ctx, fallback);
  actions = applyCurveSellPolicy(actions, ctx, profile);
  actions = applyCurveUnitPolicy(actions, ctx, profile);
  actions = dropPassWhenCurveSellIsLegal(actions, ctx, profile);
  actions = applyPromptCurve(actions, ctx, profile);
  return applyCombatSafetyPolicy(actions, ctx, fallback, scoring);
}

type CommandMove = MoveDecision & { kind: "command" };

/** Hidden zones are a count. Curve lines only read a revealed card list. */
function listedCards(zone: number | readonly FilteredCardView[] | undefined): FilteredCardView[] {
  return Array.isArray(zone) ? [...zone] : [];
}

function ownTurnIndex(turnNumber: number): number {
  return turnNumber % 2 === 1 ? (turnNumber + 1) / 2 : turnNumber / 2;
}

function cardNameOf(ctx: DecisionContext, id: string): string | undefined {
  return findCard(ctx.view, id)?.cardName ?? undefined;
}

function playedName(ctx: DecisionContext, action: CommandMove): string | undefined {
  const id =
    stringArg(action.args?.cardId) ||
    stringArg(action.args?.legendId) ||
    stringArg(action.args?.attackerId);
  return id ? cardNameOf(ctx, id) : undefined;
}

function isRryDeck(deckId: string | undefined): boolean {
  return (
    deckId === "authored-rry-llorona-steel-dragon" || deckId === "authored-rry-detonate-gear-curve"
  );
}

function keepMoves(
  actions: CommandMove[],
  predicate: (action: CommandMove) => boolean,
): CommandMove[] {
  const kept = actions.filter(predicate);
  return kept.length > 0 ? kept : actions;
}

/**
 * The opening sell has to win before min-gig and develop policies narrow the
 * list to a play. Those policies never see the spare once it has been removed.
 */
function curveOpeningSells(
  actions: CommandMove[],
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): CommandMove[] | null {
  if (
    !profile ||
    (!isRryDeck(profile.deckId) && profile.deckId !== "authored-bbg-towerfall-control")
  ) {
    return null;
  }
  const own = ownTurnIndex(ctx.view.turnNumber);
  if (own < 1 || own > 5) return null;
  const player = ctx.view.players[ctx.playerId as string];
  if (!player || player.soldThisTurn) return null;
  const spare = new Set(profile.curveSellCards ?? []);
  const sells = actions.filter(
    (action) => action.move === "sellCard" && spare.has(playedName(ctx, action) ?? ""),
  );
  return sells.length > 0 ? sells : null;
}

/**
 * Turns 1–5 of the RRY and BBG curve. Spendable €$ is Legends that can pay
 * plus ready Eddies: 2 on the play and 4 on the draw after the opening sell,
 * then 5, 6, 7, and 8. Game turn 1 is on the play; game turn 2 is on the draw.
 */
function applyPromptCurve(
  actions: CommandMove[],
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): CommandMove[] {
  if (
    !profile ||
    (!isRryDeck(profile.deckId) && profile.deckId !== "authored-bbg-towerfall-control")
  ) {
    return actions;
  }
  const own = ownTurnIndex(ctx.view.turnNumber);
  if (own < 1 || own > 5) return actions;
  const onPlay = ctx.view.turnNumber % 2 === 1;
  const playerId = ctx.playerId as string;
  const player = ctx.view.players[playerId];
  if (!player) return actions;
  if (isRryDeck(profile.deckId)) return rryCurve(actions, ctx, profile, own, onPlay);
  return bbgCurve(actions, ctx, profile, own, onPlay);
}

function rryCurve(
  actions: CommandMove[],
  ctx: DecisionContext,
  profile: DeckStrategyProfile,
  own: number,
  onPlay: boolean,
): CommandMove[] {
  const name = (action: CommandMove) => playedName(ctx, action);
  const noGoSolo = (action: CommandMove) => action.move !== "goSolo";
  if (own === 1 && onPlay) {
    return keepMoves(actions, (action) => {
      if (action.move !== "callLegend") return false;
      const legend = findCard(ctx.view, stringArg(action.args?.legendId));
      return legend?.spent === false;
    });
  }
  if (own === 1 && !onPlay) {
    return keepMoves(
      actions,
      (action) =>
        (action.move === "callLegend" &&
          (name(action) === "Muamar Reyes" || name(action) === "Dexter DeShawn")) ||
        (action.move === "playCard" &&
          (name(action) === "All is Lost" || name(action) === "The Heist")),
    );
  }
  const hand = listedCards(ctx.view.players[ctx.playerId as string]?.zones.hand);
  const handNames = new Set(hand.map((card) => card.cardName));
  const curveUnitInHand = (profile.curveUnits ?? []).some((unit) => handNames.has(unit));
  if (own === 2 && !curveUnitInHand && actions.some((action) => name(action) === "All is Lost")) {
    return keepMoves(actions, (action) => name(action) === "All is Lost");
  }
  const faces = gigFaces(ctx);
  const bladeInHand = hand.some(
    (card) => card.cardName === "Mantis Blades" || card.cardName === "Satori",
  );
  if (
    own === 2 &&
    !bladeInHand &&
    (faces.includes(1) || faces.includes(2)) &&
    actions.some((action) => name(action) === "The Heist")
  ) {
    return keepMoves(actions, (action) => name(action) === "The Heist");
  }
  if (own === 3) {
    return keepMoves(
      actions,
      (action) =>
        action.move === "playCard" &&
        (name(action) === "La Llorona" || name(action) === "Dexter DeShawn"),
    );
  }
  if (own === 4) {
    return keepMoves(
      actions,
      (action) =>
        action.move === "playCard" &&
        (name(action) === "Meredith Stout" || name(action) === "6th Street Recruits"),
    );
  }
  if (own === 5) {
    const bodies: Record<string, readonly string[]> = {
      "Mantis Blades": [
        "6th Street Recruits",
        "Meredith Stout",
        "Trauma Team Operatives",
        "Yorinobu Arasaka",
      ],
      Satori: [
        "6th Street Recruits",
        "Meredith Stout",
        "Trauma Team Operatives",
        "Yorinobu Arasaka",
      ],
      "Zetatech Faceplate": ["Meredith Stout", "La Llorona"],
    };
    const kept = actions.filter((action) => {
      if (action.move === "goSolo") return false;
      if (action.move !== "playCard" || !action.args?.attachToId) return true;
      const gear = name(action);
      const host = cardNameOf(ctx, stringArg(action.args.attachToId));
      const named = gear ? bodies[gear] : undefined;
      return named != null && host != null && named.includes(host);
    });
    return kept.length > 0
      ? kept
      : actions.filter(
          (action) =>
            action.move !== "goSolo" && !(action.move === "playCard" && action.args?.attachToId),
        );
  }
  return actions.filter(noGoSolo);
}

function bbgCurve(
  actions: CommandMove[],
  ctx: DecisionContext,
  _profile: DeckStrategyProfile,
  own: number,
  onPlay: boolean,
): CommandMove[] {
  const name = (action: CommandMove) => playedName(ctx, action);
  const faces = gigFaces(ctx);
  const trustWindow = faces.some((face) => face >= 2 && face <= 4);
  const playNamed = (action: CommandMove, card: string) =>
    action.move === "playCard" && name(action) === card;
  const field = listedCards(ctx.view.players[ctx.playerId as string]?.zones.field);
  const handNames = new Set(
    listedCards(ctx.view.players[ctx.playerId as string]?.zones.hand).map((card) => card.cardName),
  );
  if (own === 1 && onPlay) {
    const playedProgram = (ctx.view.playedCardTypesThisTurn[ctx.playerId as string] ?? []).includes(
      "program",
    );
    const called = ctx.view.players[ctx.playerId as string]?.calledLegendThisTurn === true;
    if (playedProgram || called) {
      const rest = actions.filter(
        (action) => action.move !== "callLegend" && !playNamed(action, "Trust No One"),
      );
      return rest.length > 0 ? rest : actions;
    }
    if (trustWindow && actions.some((action) => playNamed(action, "Trust No One"))) {
      return keepMoves(actions, (action) => playNamed(action, "Trust No One"));
    }
    return keepMoves(actions, (action) => action.move === "callLegend");
  }
  if (own === 1 && !onPlay) {
    const playedProgram = (ctx.view.playedCardTypesThisTurn[ctx.playerId as string] ?? []).includes(
      "program",
    );
    const called = ctx.view.players[ctx.playerId as string]?.calledLegendThisTurn === true;
    const jackedInHand = handNames.has("Jacked-In Voodoo Boy");
    const trustInHand = handNames.has("Trust No One");
    const jackedThisTurn = field.some(
      (card) => card.cardName === "Jacked-In Voodoo Boy" && card.hasLag,
    );
    const packageLive = (jackedInHand || jackedThisTurn) && (trustInHand || playedProgram);
    if (packageLive) {
      return keepMoves(
        actions,
        (action) =>
          action.move === "callLegend" ||
          playNamed(action, "Jacked-In Voodoo Boy") ||
          playNamed(action, "Trust No One"),
      );
    }
    if (playedProgram || called) {
      const rest = actions.filter(
        (action) => action.move !== "callLegend" && !playNamed(action, "Trust No One"),
      );
      return rest.length > 0 ? rest : actions;
    }
    if (trustWindow && actions.some((action) => playNamed(action, "Trust No One"))) {
      return keepMoves(actions, (action) => playNamed(action, "Trust No One"));
    }
    return keepMoves(actions, (action) => action.move === "callLegend");
  }
  const jackedOut = field.some((card) => card.cardName === "Jacked-In Voodoo Boy");
  if (own === 2) {
    const quiet = actions.filter((action) => {
      const jackedAttack =
        (action.move === "attackUnit" || action.move === "attackRival") &&
        name(action) === "Jacked-In Voodoo Boy";
      const secondCopy = jackedOut && playNamed(action, "Jacked-In Voodoo Boy");
      return !jackedAttack && !secondCopy;
    });
    if (!jackedOut && quiet.some((action) => playNamed(action, "Jacked-In Voodoo Boy"))) {
      return keepMoves(quiet, (action) => playNamed(action, "Jacked-In Voodoo Boy"));
    }
    return quiet.length > 0 ? quiet : actions;
  }
  const programPlayed = (ctx.view.playedCardTypesThisTurn[ctx.playerId as string] ?? []).includes(
    "program",
  );
  const paired = hasGigPair(faces);
  if (own === 3 && !programPlayed) {
    if (!paired && actions.some((action) => playNamed(action, "Peace Offering"))) {
      return keepMoves(actions, (action) => playNamed(action, "Peace Offering"));
    }
    if (actions.some((action) => playNamed(action, "Trust No One"))) {
      return keepMoves(actions, (action) => playNamed(action, "Trust No One"));
    }
    if (actions.some((action) => playNamed(action, "Floor It"))) {
      return keepMoves(actions, (action) => playNamed(action, "Floor It"));
    }
  }
  if (own === 3 && programPlayed && jackedOut) {
    return keepMoves(
      actions,
      (action) =>
        (action.move === "attackUnit" || action.move === "attackRival") &&
        name(action) === "Jacked-In Voodoo Boy",
    );
  }
  const pepeOut = field.some((card) => card.cardName === "Pepe Najarro");
  if (own === 4 && actions.some((action) => playNamed(action, "Pepe Najarro"))) {
    return keepMoves(actions, (action) => playNamed(action, "Pepe Najarro"));
  }
  if (own === 4 && pepeOut && paired && pepeWouldReadyMercs(ctx)) {
    return keepMoves(
      actions,
      (action) =>
        (action.move === "attackUnit" || action.move === "attackRival") &&
        name(action) === "Pepe Najarro",
    );
  }
  if (own === 4 && pepeOut && (!paired || !pepeWouldReadyMercs(ctx))) {
    return actions.filter(
      (action) => name(action) !== "Pepe Najarro" || action.move === "playCard",
    );
  }
  const lizzyPrograms = new Set([
    "Chrome Reverie",
    "Nocturne OP55 N1",
    "Pyramid Song",
    "Three Mouths, One Desire",
    "Trust No One",
    "Peace Offering",
    "Floor It",
  ]);
  const zones = ctx.view.players[ctx.playerId as string]?.zones;
  const hasPayload = ["hand", "trash"].some(
    (zone) =>
      Array.isArray(zones?.[zone]) &&
      zones[zone].some(
        (card) =>
          card.type === "program" &&
          card.cost != null &&
          card.cost <= 3 &&
          lizzyPrograms.has(card.cardName ?? ""),
      ),
  );
  if (own === 5 && hasPayload && actions.some((action) => playNamed(action, "Lizzy Wizzy"))) {
    return keepMoves(actions, (action) => playNamed(action, "Lizzy Wizzy"));
  }
  return actions;
}

function gigFaces(ctx: DecisionContext): number[] {
  const zone = ctx.view.players[ctx.playerId as string]?.zones.gigArea;
  if (!Array.isArray(zone)) return [];
  return zone.map((gig) => gig.effectivePower ?? gig.power ?? 0);
}

function hasGigPair(faces: number[]): boolean {
  const seen = new Set<number>();
  for (const face of faces) {
    if (seen.has(face)) return true;
    seen.add(face);
  }
  return false;
}

/**
 * A unit-hosted Gear with no unit on board is stranded. Sell a spare program
 * instead of passing the turn and skipping the curve.
 */
function applyCurveSellPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): Array<MoveDecision & { kind: "command" }> {
  if (!profile?.gearHostTypes) return actions;
  const player = ctx.view.players[ctx.playerId as string];
  const hand = player?.zones.hand;
  if (!Array.isArray(hand)) return actions;
  const stranded = hand.some(
    (card) => card.cardName != null && profile.gearHostTypes?.[card.cardName] === "unit",
  );
  if (!stranded) return actions;
  const field = player?.zones.field;
  if (Array.isArray(field) && field.some((card) => card.type === "unit")) return actions;
  const spareSell = actions.some((action) => {
    if (action.move !== "sellCard") return false;
    return !isCoreCardName(findCard(ctx.view, stringArg(action.args?.cardId))?.cardName, profile);
  });
  if (!spareSell) return actions;
  const kept = actions.filter((action) => action.move !== "passPhase");
  return kept.length > 0 ? kept : actions;
}

function curveSellNames(profile: DeckStrategyProfile | undefined): readonly string[] {
  return profile?.curveSellCards ?? [];
}

function dropPassWhenCurveSellIsLegal(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): Array<MoveDecision & { kind: "command" }> {
  const names = curveSellNames(profile);
  if (names.length === 0) return actions;
  const player = ctx.view.players[ctx.playerId as string];
  if (!player || player.soldThisTurn) return actions;
  const spare = actions.some((action) => {
    if (action.move !== "sellCard") return false;
    const name = findCard(ctx.view, stringArg(action.args?.cardId))?.cardName;
    return name != null && names.includes(name);
  });
  if (!spare) return actions;
  const kept = actions.filter((action) => action.move !== "passPhase");
  return kept.length > 0 ? kept : actions;
}

function applyCurveUnitPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): Array<MoveDecision & { kind: "command" }> {
  const names = profile?.curveUnits;
  if (!names || names.length === 0) return actions;
  let cheapest = Number.POSITIVE_INFINITY;
  for (const action of actions) {
    if (action.move !== "playCard" || action.args?.attachToId) continue;
    const card = findCard(ctx.view, stringArg(action.args?.cardId));
    if (!card?.cardName || !names.includes(card.cardName)) continue;
    const cost = card.effectiveCost ?? card.cost ?? Number.POSITIVE_INFINITY;
    if (cost < cheapest) cheapest = cost;
  }
  if (!Number.isFinite(cheapest)) return actions;
  const kept = actions.filter((action) => {
    if (action.move !== "playCard" || action.args?.attachToId) return true;
    const card = findCard(ctx.view, stringArg(action.args?.cardId));
    if (!card?.cardName || !names.includes(card.cardName)) return true;
    return (card.effectiveCost ?? card.cost ?? Number.POSITIVE_INFINITY) === cheapest;
  });
  return kept.length > 0 ? kept : actions;
}

/**
 * Deck lines that search will not discover on its own: keep a payload in
 * hand for the carrier that plays it, take that payload when the free-play
 * choice is open, do not decline a source that must resolve, and set a min
 * Gig when that source asks for one.
 */
function applyPlayLinePolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
): Array<MoveDecision & { kind: "command" }> {
  if (!profile) return actions;
  let next = applyPriorityPlayPolicy(actions, ctx, profile);
  next = applyCarrierFirstPolicy(next, ctx, profile);
  next = applyPlayThroughPolicy(next, ctx, profile);
  next = applyMinGigPlayPolicy(next, ctx, profile);
  next = applyPreferredFreeCardPolicy(next, ctx, profile);
  next = applyCommitSourcePolicy(next, ctx, profile);
  next = applyMinGigPolicy(next, ctx, profile);
  return next;
}

function applyPriorityPlayPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile,
): Array<MoveDecision & { kind: "command" }> {
  const names = profile.priorityPlays;
  if (!names || names.length === 0 || !rivalUnitCanAttack(ctx)) return actions;
  const hand = ctx.view.players[ctx.playerId as string]?.zones.hand;
  const holdingProgram = Array.isArray(hand) && hand.some((card) => card.type === "program");
  if (!holdingProgram) return actions;
  const wanted = new Set(names);
  const plays = actions.filter((action) => {
    if (action.move !== "playCard") return false;
    const name = findCard(ctx.view, stringArg(action.args?.cardId))?.cardName;
    return name != null && wanted.has(name);
  });
  return plays.length > 0 ? plays : actions;
}

function applyCarrierFirstPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile,
): Array<MoveDecision & { kind: "command" }> {
  if (!profile.playThrough || !rivalUnitCanAttack(ctx)) return actions;
  for (const [carrier, payloads] of Object.entries(profile.playThrough)) {
    const payloadNames = new Set(payloads);
    const hand = ctx.view.players[ctx.playerId as string]?.zones.hand;
    const holdingPayload =
      Array.isArray(hand) &&
      hand.some((card) => card.cardName != null && payloadNames.has(card.cardName));
    if (!holdingPayload) continue;
    const carrierPlays = actions.filter((action) => {
      if (action.move !== "playCard") return false;
      return findCard(ctx.view, stringArg(action.args?.cardId))?.cardName === carrier;
    });
    if (carrierPlays.length > 0) return carrierPlays;
  }
  return actions;
}

function rivalUnitCanAttack(ctx: DecisionContext): boolean {
  for (const [id, player] of Object.entries(ctx.view.players)) {
    if (id === (ctx.playerId as string)) continue;
    const field = player.zones.field;
    if (!Array.isArray(field)) continue;
    if (
      field.some(
        (card) =>
          card.type === "unit" &&
          !card.spent &&
          !card.hasLag &&
          !card.grantedRules.includes("cantAttack"),
      )
    ) {
      return true;
    }
  }
  return false;
}

function expandAtomicGigAdjust(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
): Array<MoveDecision & { kind: "command" }> {
  const choice = ctx.prompt.choice;
  if (
    choice?.type !== "chooseTarget" ||
    choice.payload.type !== "effectTarget" ||
    !choice.payload.adjustGig
  ) {
    return actions;
  }
  const spec = choice.payload.adjustGig;
  const direction = spec.direction ?? "either";
  const maxAmount = spec.maxAmount ?? 0;
  const adjusted: Array<MoveDecision & { kind: "command" }> = [];
  for (const dieId of choice.payload.eligibleIds ?? []) {
    const gig = findCard(ctx.view, dieId);
    if (!gig) continue;
    const current = gig.effectivePower ?? gig.power ?? 0;
    const maxFace = dieMaxFace(gig.definitionId) ?? current;
    const min = direction === "increase" ? current : Math.max(1, current - maxAmount);
    const max = direction === "decrease" ? current : Math.min(maxFace, current + maxAmount);
    for (let value = min; value <= max; value += 1) {
      if (value === current) continue;
      adjusted.push({
        kind: "command",
        move: "resolveAdjustGig",
        args: { kind: "adjust", dieId, value },
      });
    }
  }
  if (spec.chooseUpTo || choice.payload.canDecline || (choice.payload.min ?? 1) === 0) {
    adjusted.push({ kind: "command", move: "resolveAdjustGig", args: { kind: "noAdjustment" } });
  }
  return adjusted.length > 0 ? adjusted : actions;
}

function dieMaxFace(dieType: string): number | undefined {
  switch (dieType) {
    case "d4":
      return 4;
    case "d6":
      return 6;
    case "d8":
      return 8;
    case "d10":
      return 10;
    case "d12":
      return 12;
    case "d20":
      return 20;
    default:
      return undefined;
  }
}

function applyPlayThroughPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile,
): Array<MoveDecision & { kind: "command" }> {
  if (!profile.playThrough) return actions;
  let next = actions;
  for (const [carrier, payloads] of Object.entries(profile.playThrough)) {
    const carrierLegal = next.some((action) => {
      if (action.move !== "playCard") return false;
      return findCard(ctx.view, stringArg(action.args?.cardId))?.cardName === carrier;
    });
    if (!carrierLegal) continue;
    const payloadNames = new Set(payloads);
    const hand = ctx.view.players[ctx.playerId as string]?.zones.hand;
    const holdingPayload =
      Array.isArray(hand) && hand.some((card) => card.cardName && payloadNames.has(card.cardName));
    if (!holdingPayload) continue;
    const kept = next.filter((action) => {
      if (action.move !== "playCard") return true;
      const name = findCard(ctx.view, stringArg(action.args?.cardId))?.cardName;
      return !name || !payloadNames.has(name);
    });
    if (kept.length > 0) next = kept;
  }
  return next;
}

function applyPreferredFreeCardPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile,
): Array<MoveDecision & { kind: "command" }> {
  const preferred = profile.preferredFreeCards;
  if (!preferred || preferred.length === 0) return actions;
  const names = new Set(preferred);
  const kept = actions.filter((action) => {
    const playedId = playedCardId(action);
    if (!playedId) return false;
    const name = choiceCardName(ctx, playedId);
    return name != null && names.has(name);
  });
  return kept.length > 0 ? kept : actions;
}

function choiceCardName(ctx: DecisionContext, instanceId: string): string | undefined {
  const visible = findCard(ctx.view, instanceId)?.cardName;
  if (visible) return visible;
  const choice = ctx.prompt.choice;
  if (!choice) return undefined;
  if (choice.type === "chooseTarget" || choice.type === "chooseCardToPlay") {
    return (
      choice.payload.cards?.find((card) => card.instanceId === instanceId)?.cardName ?? undefined
    );
  }
  return undefined;
}

function playedCardId(action: MoveDecision & { kind: "command" }): string {
  if (action.move === "resolveCardToPlay") return stringArg(action.args?.cardId);
  if (action.move !== "resolveEffectTarget") return "";
  const targetIds = action.args?.targetIds;
  return Array.isArray(targetIds) && typeof targetIds[0] === "string" ? targetIds[0] : "";
}

function applyCommitSourcePolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile,
): Array<MoveDecision & { kind: "command" }> {
  const sources = profile.commitSources;
  if (!sources || sources.length === 0) return actions;
  const sourceName = choiceSourceName(ctx);
  if (!sourceName || !sources.includes(sourceName)) return actions;
  const kept = actions.filter(
    (action) => action.args?.pass !== true && action.args?.kind !== "noAdjustment",
  );
  return kept.length > 0 ? kept : actions;
}

function pepeWouldReadyMercs(ctx: DecisionContext): boolean {
  const legends = ctx.view.players[ctx.playerId as string]?.zones.legendArea;
  if (!Array.isArray(legends)) return false;
  const mercs = new Set(["Alt Cunningham", "Jackie Welles"]);
  return legends.some(
    (card) =>
      card.cardName != null &&
      mercs.has(card.cardName) &&
      card.spent &&
      !card.faceDown &&
      card.classifications.includes("Merc"),
  );
}

function applyMinGigPlayPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile,
): Array<MoveDecision & { kind: "command" }> {
  const sources = profile.minGigSources;
  if (!sources || sources.length === 0) return actions;
  const own = ownTurnIndex(ctx.view.turnNumber);
  if (profile.deckId === "authored-bbg-towerfall-control" && own >= 1 && own <= 5) return actions;
  const gigs = ctx.view.players[ctx.playerId as string]?.zones.gigArea;
  const aboveMin =
    Array.isArray(gigs) && gigs.some((gig) => (gig.effectivePower ?? gig.power ?? 0) > 1);
  if (!aboveMin) return actions;
  const kept = actions.filter((action) => {
    if (action.move !== "playCard") return false;
    const name = findCard(ctx.view, stringArg(action.args?.cardId))?.cardName;
    return name != null && sources.includes(name);
  });
  return kept.length > 0 ? kept : actions;
}

function applyMinGigPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile,
): Array<MoveDecision & { kind: "command" }> {
  const sources = profile.minGigSources;
  if (!sources || sources.length === 0) return actions;
  if (ctx.prompt.choice?.type !== "chooseTarget") return actions;
  const payload = ctx.prompt.choice.payload;
  const atomicAdjust = payload.type === "effectTarget" && payload.adjustGig !== undefined;
  if (payload.type !== "adjustGig" && !atomicAdjust) return actions;
  const sourceName = choiceSourceName(ctx);
  if (!sourceName || !sources.includes(sourceName)) return actions;
  const minGig = actions.filter((action) => {
    if (action.move !== "resolveAdjustGig" || action.args?.value !== 1) return false;
    const dieId = stringArg(action.args?.dieId);
    return dieId !== "" && gigOwner(ctx, dieId) === (ctx.playerId as string);
  });
  return minGig.length > 0 ? minGig : actions;
}

function gigOwner(ctx: DecisionContext, dieId: string): string | undefined {
  for (const [playerId, player] of Object.entries(ctx.view.players)) {
    const gigs = player.zones.gigArea;
    if (Array.isArray(gigs) && gigs.some((gig) => gig.instanceId === dieId)) return playerId;
  }
  return undefined;
}

function choiceSourceName(ctx: DecisionContext): string | undefined {
  const choice = ctx.prompt.choice;
  if (!choice || choice.type !== "chooseTarget") return undefined;
  const sourceId = choice.payload.source?.cardId;
  if (!sourceId) return undefined;
  return findCard(ctx.view, sourceId)?.cardName ?? undefined;
}

/**
 * When a deck profile names preferred Gear hosts and at least one is a legal
 * attach target, drop every other host for that Gear. Tactical search otherwise
 * scores a high-power Unit above a face-up Legend and installs Overwatch /
 * Sandevistan on the wrong body. Independent of a profile, a face-up Legend
 * without [GO SOLO] never receives a Gear whose only payload is raw power.
 */
function applyGearHostPolicy(
  actions: Array<MoveDecision & { kind: "command" }>,
  ctx: DecisionContext,
  profile: DeckStrategyProfile | undefined,
  scoring: TacticalScoringOptions,
): Array<MoveDecision & { kind: "command" }> {
  const legendHoldEnabled = !scoring.disabled.has("legend-gear");
  if (!profile && !legendHoldEnabled) return actions;

  let next = actions;
  if (profile) {
    const HOST_RANK: Record<ReturnType<typeof gearHostMatch>, number> = {
      preferred: 0,
      typed: 1,
      named: 2,
      none: 3,
    };
    const bestRank = new Map<string, number>();
    for (const action of next) {
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
    if (bestRank.size > 0) {
      next = next.filter((action) => {
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
      // Unit-hosted gear stays in hand until a unit can carry it. A Legend is
      // a legal attach in the rules and search will take it; the curve bodies
      // are the plan.
      const unitHosted = next.filter((action) => {
        if (action.move !== "playCard") return true;
        const gearName = findCard(ctx.view, stringArg(action.args?.cardId))?.cardName;
        if (!gearName || profile.gearHostTypes?.[gearName] !== "unit") return true;
        const match = gearHostMatch(
          gearName,
          findCard(ctx.view, stringArg(action.args?.attachToId)),
          profile,
        );
        return match === "preferred" || match === "typed";
      });
      if (unitHosted.length > 0) next = unitHosted;
    }
  }
  if (!legendHoldEnabled) return next;
  const held = next.filter((action) => {
    if (action.move !== "playCard") return true;
    const gear = findCard(ctx.view, stringArg(action.args?.cardId));
    const gearName = gear?.cardName;
    if (!gearName || !gear) return true;
    const host = findCard(ctx.view, stringArg(action.args?.attachToId));
    if (!host) return true;
    // A face-up Legend stuck in the Legend area without [GO SOLO] can never
    // fight or steal: raw power there is dead weight. Gears with real effects
    // (or a profile-named host) still attach.
    if (host.zone !== "legendArea" || host.faceDown) return true;
    if (host.keywords.includes("goSolo") || host.grantedRules.includes("goSolo")) return true;
    if (gearHasOwnEffects(gear)) return true;
    const match = gearHostMatch(gearName, host, profile);
    return match === "preferred" || match === "named";
  });
  return held.length > 0 ? held : next;
}

/**
 * True when the Gear grants something beyond its raw power (static or
 * triggered abilities visible on the card), so a Legend host can still use it.
 */
function gearHasOwnEffects(gear: FilteredCardView): boolean {
  return gear.abilityHints.length > 0 || gear.triggerHints.length > 0;
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
    const card = findCard(ctx.view, stringArg(action.args?.cardId));
    const leavesLegendArea =
      action.move === "goSolo" ||
      (action.move === "playCard" && card?.zone === "legendArea" && card.type === "legend");
    if (!leavesLegendArea) return true;
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
  scoring: TacticalScoringOptions,
): Array<MoveDecision & { kind: "command" }> {
  // In the final Gig race, passing can win, a BLOCKER may need to stay ready,
  // and a losing fight may open the winning steal. Compare all legal responses
  // in the search instead of vetoing them with the normal material policy.
  if (isLateGigRace(ctx.view)) return actions;
  let filtered = filterUnsafeFights(actions, ctx.view, scoring);
  filtered = filterUnsafeDirectAttacks(filtered, ctx.view, ctx.playerId as string, scoring);

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

/**
 * Fights keep only rule-compliant attackers: for each defender the plan sends
 * the weakest Unit that still wins the fight, preserving ≥10-power bodies
 * that steal two Gigs. When such a removal exists, combat outranks
 * developing: develop plays and passes are dropped for this prompt (the
 * following prompt still develops).
 */
function filterUnsafeFights(
  actions: Array<MoveDecision & { kind: "command" }>,
  view: FilteredMatchView,
  scoring: TacticalScoringOptions,
): Array<MoveDecision & { kind: "command" }> {
  const fights = actions.filter((action) => action.move === "attackUnit");
  if (fights.length === 0) return actions;
  const requiredAttackerIds = new Set(
    fights
      .map((action) => stringArg(action.args?.attackerId))
      .filter((id) => findCard(view, id)?.grantedRules.includes("mustAttack") === true),
  );
  const removalPlanned = requiredAttackerIds.size === 0 && !scoring.disabled.has("remove-targets");
  const preferredPairs = new Set<string>();
  if (removalPlanned) {
    const winnersByDefender = new Map<string, Array<{ id: string; power: number }>>();
    for (const action of fights) {
      const attacker = findCard(view, stringArg(action.args?.attackerId));
      const defender = findCard(view, stringArg(action.args?.defenderId));
      if (!attacker || !defender) continue;
      if ((attacker.effectivePower ?? 0) <= (defender.effectivePower ?? 0)) continue;
      const winners = winnersByDefender.get(defender.instanceId) ?? [];
      winners.push({ id: attacker.instanceId, power: attacker.effectivePower });
      winnersByDefender.set(defender.instanceId, winners);
    }
    for (const [defenderId, winners] of winnersByDefender) {
      winners.sort((a, b) => a.power - b.power || a.id.localeCompare(b.id));
      preferredPairs.add(`${winners[0]!.id}:${defenderId}`);
    }
  }
  const removalAvailable = requiredAttackerIds.size > 0 || preferredPairs.size > 0;
  const mandate = removalAvailable && !scoring.disabled.has("remove-targets");
  return actions.filter((action) => {
    if (action.move !== "attackUnit") {
      if (!mandate) return true;
      // A removal exists: this prompt is combat. Keep steals (a second body
      // can still take the gig race) but drop developing and passing.
      return action.move === "attackRival";
    }
    const attackerId = stringArg(action.args?.attackerId);
    if (requiredAttackerIds.size > 0) return requiredAttackerIds.has(attackerId);
    const attacker = findCard(view, attackerId);
    const defender = findCard(view, stringArg(action.args?.defenderId));
    if (!attacker || !defender) return false;
    if ((attacker.effectivePower ?? 0) <= (defender.effectivePower ?? 0)) return false;
    if (!removalPlanned) return true;
    return preferredPairs.has(`${attackerId}:${defender.instanceId}`);
  });
}

/**
 * Direct Gig-area attacks: at parity or behind, an attacker must beat the
 * strongest ready blocker. With more attack-ready Units than rival ready
 * Units, weaker attackers may draw a block and leave a spare attacker.
 * A 0-power Unit steals nothing, so it never attacks the Gig area. When no
 * blocker can respond at all ("free steal" — no rival ready blocker and at
 * least one Gig to take), the steal is strictly +EV: this prompt becomes the
 * steal, plus any already-planned removal fights.
 */
function filterUnsafeDirectAttacks(
  actions: Array<MoveDecision & { kind: "command" }>,
  view: FilteredMatchView,
  actorId: string,
  scoring: TacticalScoringOptions,
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
  const pressureWithSpareUnits = hasReadyUnitAdvantage(view, actorId);
  const safe =
    required.length > 0
      ? required
      : attacks.filter((action) => {
          const attacker = findCard(view, stringArg(action.args?.attackerId));
          return (
            rivalGigs > 0 &&
            (attacker?.effectivePower ?? 0) > 0 &&
            (pressureWithSpareUnits || (attacker?.effectivePower ?? 0) > strongestBlocker)
          );
        });
  const selected = [...safe].sort((a, b) => {
    const aId = stringArg(a.args?.attackerId);
    const bId = stringArg(b.args?.attackerId);
    const powerDelta =
      (findCard(view, bId)?.effectivePower ?? 0) - (findCard(view, aId)?.effectivePower ?? 0);
    return powerDelta !== 0 ? powerDelta : aId.localeCompare(bId);
  })[0];
  const stealOnly =
    selected !== undefined &&
    rivalBlockers.length === 0 &&
    !scoring.disabled.has("safe-steal") &&
    !actions.some((action) => action.move === "useBlocker");
  if (stealOnly) {
    return actions.filter((action) => action === selected || action.move === "attackUnit");
  }
  return actions.filter(
    (action) =>
      action.move !== "attackRival" ||
      (pressureWithSpareUnits ? safe.includes(action) : action === selected),
  );
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
    if (isPublicRivalUnitBottomDeckMove(before, action, actor, playerId)) continue;
    // A self-deck reveal activation is scored from its deterministic fork and
    // its owner sees the revealed card; the owner's own deck shrinking is not
    // unknown information. Any other deck delta stays hidden.
    if (selfDeckReveal && playerId === actor) continue;
    return true;
  }
  return false;
}

/**
 * Bottom-decking a known, face-up rival Unit changes a public board fact: that
 * Unit left the field. The deck's identity/order stays hidden, but cutting the
 * search off before this move would erase the removal from board evaluation.
 */
function isPublicRivalUnitBottomDeckMove(
  before: FilteredMatchView,
  action: MoveDecision & { kind: "command" },
  actor: PlayerId,
  changedDeckPlayerId: string,
): boolean {
  if (action.move !== "resolveEffectTarget" || changedDeckPlayerId === (actor as string)) {
    return false;
  }
  const prompt = before.prompt;
  if (prompt.status !== "choice" || prompt.choice?.type !== "chooseTarget") return false;
  const choice = prompt.choice;
  if (
    choice.payload.type !== "effectTarget" ||
    choice.payload.effect?.effect !== "moveCard" ||
    choice.payload.effect.destination !== "deckBottom"
  ) {
    return false;
  }
  const targetIds = action.args?.targetIds;
  const eligibleIds = choice.payload.eligibleIds ?? [];
  if (
    !Array.isArray(targetIds) ||
    targetIds.length === 0 ||
    !targetIds.every((id) => typeof id === "string" && eligibleIds.includes(id))
  ) {
    return false;
  }

  return targetIds.every((id) =>
    Object.entries(before.players).some(([playerId, player]) => {
      if (playerId === (actor as string) || playerId !== changedDeckPlayerId) return false;
      const field = player.zones.field;
      return (
        Array.isArray(field) &&
        field.some((card) => card.instanceId === id && card.type === "unit" && !card.faceDown)
      );
    }),
  );
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
  scoring: TacticalScoringOptions,
): number {
  budget.cutoffReason = "hidden-information";
  return (
    evaluateBoard(before, rootPlayerId as string) +
    (action.move === "passPhase"
      ? evaluateLateGigRace(before, rootPlayerId as string, true) -
        evaluateLateGigRace(before, rootPlayerId as string)
      : 0) +
    (actor === rootPlayerId ? 1 : -1) *
      actionPrior(
        action,
        before,
        actor as string,
        actor === rootPlayerId ? profile : undefined,
        scoring,
      )
  );
}

const HOST_PRIOR: Record<ReturnType<typeof gearHostMatch>, number> = {
  preferred: 12,
  typed: 6,
  named: 2,
  none: 0,
};

/**
 * Gear power planning (H3): a Gear should either push its host across a
 * steal breakpoint (10, 20, … power), or make a Unit the strict top body on
 * the board (higher than every rival Unit — equal still loses the fight).
 * Attaching for neither reason just pads a body; every already-stacked Gear
 * makes the next one less interesting.
 */
function gearPowerPlanningPrior(
  gear: FilteredCardView,
  host: FilteredCardView | null,
  view: FilteredMatchView,
  actorId: string,
  scoring?: TacticalScoringOptions,
): number {
  if (!scoring || scoring.disabled.has("gear-power")) return 0;
  if (!host || host.faceDown) return 0;
  const gearPower = Math.max(0, gear.effectivePower);
  if (gearPower === 0) return 0;
  const before = Math.max(0, host.effectivePower);
  const after = before + gearPower;
  const breakpointGain = Math.floor(after / 10) > Math.floor(before / 10);
  const rivalTopPower = rivalTopUnitPower(view, actorId);
  const becomesTopSafe = after > rivalTopPower && before <= rivalTopPower;
  if (breakpointGain || becomesTopSafe) return 60;
  const stackedGears = host.attachedGearIds.length;
  return -10 - 12 * stackedGears;
}

function rivalTopUnitPower(view: FilteredMatchView, actorId: string): number {
  let top = 0;
  for (const [playerId, player] of Object.entries(view.players)) {
    if (playerId === actorId) continue;
    const field = player.zones.field;
    if (!Array.isArray(field)) continue;
    for (const card of field) {
      if (card.type !== "unit" || card.faceDown) continue;
      top = Math.max(top, card.effectivePower);
    }
  }
  return top;
}

function actionPrior(
  action: MoveDecision & { kind: "command" },
  view: FilteredMatchView,
  actorId: string,
  profile?: DeckStrategyProfile,
  scoring?: TacticalScoringOptions,
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
      if (
        profile?.pacing === "develop-first" &&
        isCoreCardName(card.cardName, profile) &&
        (view.players[actorId]?.gigCount ?? 0) < 5
      ) {
        prior += card.type === "unit" ? 150 : 40;
      }
      const host = findCard(view, stringArg(action.args?.attachToId));
      prior += HOST_PRIOR[gearHostMatch(card.cardName, host, profile)];
      prior += gearPowerPlanningPrior(card, host, view, actorId, scoring);
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
