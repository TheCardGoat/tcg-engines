import { createPlayerId, type PlayerId } from "../../types/branded.ts";
import type { FilteredMatchView } from "../../view/filter.ts";
import type { CommandEnvelope } from "../../types/commands.ts";
import type { PlayerPrompt } from "../../view/player-prompt.ts";
import { runResolver } from "../ai-player.ts";
import { semanticViewHash } from "../public-view-hash.ts";
import { greedyStrategy } from "../strategies/greedy.ts";
import type { AIStrategy, DecisionContext, EngineHandle, MoveDecision } from "../types.ts";
import { evaluateBoard } from "./evaluate-board.ts";
import { enumerateCandidateActions, enumerateChoiceActions } from "./shared.ts";

type Action = Extract<MoveDecision, { kind: "command" }>;

/** Projections are expensive. Cache only within this decision's private forks. */
class SearchEngine implements EngineHandle {
  private views = new Map<PlayerId, FilteredMatchView>();
  private prompts = new Map<PlayerId, PlayerPrompt>();
  constructor(private readonly source: EngineHandle) {}
  getFilteredView(player: PlayerId) {
    return this.source.getFilteredView(player);
  }
  getOracleView(player: PlayerId): FilteredMatchView {
    let view = this.views.get(player);
    if (!view) {
      view = oracleView(this.source, player);
      this.views.set(player, view);
    }
    return view;
  }
  getPrompt(player: PlayerId): PlayerPrompt {
    let prompt = this.prompts.get(player);
    if (!prompt) {
      prompt = this.source.getPrompt(player);
      this.prompts.set(player, prompt);
    }
    return prompt;
  }
  processCommand(command: CommandEnvelope, player: PlayerId) {
    this.views.clear();
    this.prompts.clear();
    return this.source.processCommand(command, player);
  }
  fork(): EngineHandle {
    return new SearchEngine(this.source.fork());
  }
}
interface Line {
  engine: EngineHandle;
  first: Action;
  score: number;
  depth: number;
  seen: ReadonlySet<string>;
}
export interface ExpertOracleOptions {
  beamWidth?: number;
  depthLimit?: number;
  replyLines?: number;
  maxNodes?: number;
  /** Value of each field Unit independent of its power; zero reproduces v9. */
  unitDevelopmentWeight?: number;
}

function oracleView(engine: EngineHandle, player: PlayerId): FilteredMatchView {
  if (!engine.getOracleView) throw new Error("Expert requires a full-information practice engine.");
  return engine.getOracleView(player);
}

function actor(engine: EngineHandle, root: PlayerId): PlayerId | undefined {
  const view = oracleView(engine, root);
  if (view.gameEnded) return undefined;
  const ids = Object.keys(view.players).map(createPlayerId);
  ids.sort((a, b) => Number(b === view.activePlayerId) - Number(a === view.activePlayerId));
  return ids.find((id) => {
    const status = engine.getPrompt(id).status;
    return status === "action" || status === "choice";
  });
}

function context(engine: EngineHandle, playerId: PlayerId): DecisionContext {
  return {
    engine,
    playerId,
    view: oracleView(engine, playerId),
    prompt: engine.getPrompt(playerId),
    rng: () => 0.5,
  };
}

function actions(ctx: DecisionContext): Action[] {
  if (ctx.prompt.choice) {
    const expanded = enumerateChoiceActions(ctx.prompt.choice);
    if (expanded.length) return expanded;
    const resolved = runResolver(ctx.prompt.choice, greedyStrategy, ctx);
    return resolved.kind === "command" ? [resolved] : [];
  }
  return enumerateCandidateActions(ctx.prompt);
}

// These weights are ours. The external bot's fitted constants are not portable
// across different feature definitions, engines, and card pools.
function score(engine: EngineHandle, root: PlayerId, unitDevelopmentWeight: number): number {
  const view = oracleView(engine, root);
  const base = evaluateBoard(view, root);
  if (view.gameEnded) return base;
  const handValue = (id: string) => {
    const player = view.players[id];
    if (!player || !Array.isArray(player.zones.hand)) return 0;
    return player.zones.hand.reduce(
      (sum, card) =>
        sum +
        (card.type === "unit" ? Math.max(0, card.effectivePower) * 2 : 0) +
        ((card.effectiveCost ?? card.cost ?? Infinity) <= player.availableEddies ? 8 : 0),
      0,
    );
  };
  const development = (id: string) => {
    const field = view.players[id]?.zones.field;
    return Array.isArray(field)
      ? field.filter((card) => card.type === "unit" || card.type === "legend").length *
          unitDevelopmentWeight
      : 0;
  };
  return (
    base +
    handValue(root) -
    Object.keys(view.players)
      .filter((id) => id !== root)
      .reduce((sum, id) => sum + handValue(id), 0) +
    development(root) -
    Object.keys(view.players)
      .filter((id) => id !== root)
      .reduce((sum, id) => sum + development(id), 0)
  );
}

function key(engine: EngineHandle, root: PlayerId): string {
  // Include the current chooser's prompt: opening a choice can leave the board
  // unchanged, but declining back to the same action state is a real cycle.
  const next = actor(engine, root);
  return semanticViewHash({
    view: oracleView(engine, root),
    actor: next,
    prompt: next ? engine.getPrompt(next) : null,
  });
}

/** Opt-in, full-information turn planner. All transitions still use legal commands. */
export function createExpertOracleStrategy(options: ExpertOracleOptions = {}): AIStrategy {
  const positive = (value: number | undefined, fallback: number) =>
    Number.isFinite(value) ? Math.max(1, Math.floor(value!)) : fallback;
  const width = positive(options.beamWidth, 5);
  const depthLimit = positive(options.depthLimit, 12);
  const replies = positive(options.replyLines, 4);
  const maxNodes = positive(options.maxNodes, 768);
  const unitDevelopmentWeight =
    typeof options.unitDevelopmentWeight === "number" &&
    Number.isFinite(options.unitDevelopmentWeight)
      ? Math.max(0, options.unitDevelopmentWeight)
      : 40;
  // A fresh search at a pending choice must remember the live board that
  // opened it. Otherwise activate -> decline can look useful in each search
  // separately even though the real bot never advances. Scope history to the
  // engine, player and turn; simulated forks never enter this history.
  const liveHistory = new WeakMap<
    EngineHandle,
    Map<PlayerId, { scope: string; revision: number; states: Set<string> }>
  >();

  const decide = (original: DecisionContext): MoveDecision => {
    if (!original.engine?.getOracleView)
      return { kind: "stuck", reason: "Expert requires a full-information practice engine." };
    const engine = new SearchEngine(original.engine);
    const root = original.playerId;
    const ctx = context(engine, root);
    // Keep the existing opening-hand policy; full-turn search starts after setup.
    if (ctx.prompt.availableMoves.some((move) => move.moveId === "mulligan"))
      return greedyStrategy.decideAction(ctx);
    let players = liveHistory.get(original.engine);
    if (!players) {
      players = new Map();
      liveHistory.set(original.engine, players);
    }
    const scope = `${ctx.view.turnNumber}/${ctx.view.activePlayerId}`;
    let history = players.get(root);
    if (!history || history.scope !== scope || ctx.view.stateID < history.revision) {
      history = { scope, revision: ctx.view.stateID, states: new Set() };
      players.set(root, history);
    }
    history.revision = ctx.view.stateID;
    history.states.add(key(engine, root));
    const candidates = actions(ctx);
    if (!candidates.length) return { kind: "stuck", reason: "No legal expert action." };
    if (candidates.length === 1) return candidates[0]!;
    let nodes = 0;
    let deepest = 0;
    const planningLimit = Math.max(1, Math.floor(maxNodes * 0.7));
    const initialTurn = ctx.view.turnNumber;
    const initialActive = ctx.view.activePlayerId;
    const apply = (
      from: EngineHandle,
      who: PlayerId,
      action: Action,
      limit: number,
    ): EngineHandle | undefined => {
      if (nodes >= limit) return undefined;
      nodes += 1;
      const child = from.fork();
      const result = child.processCommand(
        { commandID: `expert:${nodes}`, move: action.move, input: { args: action.args ?? {} } },
        who,
      );
      return result.success ? child : undefined;
    };
    const rank = (lines: Line[], count: number) =>
      lines.sort((a, b) => b.score - a.score || a.depth - b.depth).slice(0, count);
    const boundary = (from: EngineHandle) => {
      const view = oracleView(from, root);
      return (
        view.gameEnded || view.turnNumber !== initialTurn || view.activePlayerId !== initialActive
      );
    };
    // A bounded one-step opponent policy. Resolve forced continuations before
    // evaluating an attack, so "declare" is not scored as its final outcome.
    const response = (
      from: EngineHandle,
      who: PlayerId,
      limit: number,
      seen: ReadonlySet<string>,
    ): EngineHandle | undefined => {
      let best: EngineHandle | undefined;
      let bestScore = -Infinity;
      for (const action of actions(context(from, who))) {
        let child = apply(from, who, action, limit);
        if (!child) continue;
        for (let step = 0; step < 12 && nodes < limit; step++) {
          const next = actor(child, root);
          if (!next) break;
          const forced = actions(context(child, next));
          if (forced.length !== 1) break;
          const resolved = apply(child, next, forced[0]!, limit);
          if (!resolved || key(resolved, root) === key(child, root)) break;
          child = resolved;
        }
        if (seen.has(key(child, root))) continue;
        const value = score(child, who, unitDevelopmentWeight);
        if (value > bestScore) {
          best = child;
          bestScore = value;
        }
      }
      return best;
    };
    const advance = (line: Line, limit: number): Line | undefined => {
      let child = line.engine;
      const seen = new Set(line.seen);
      for (let step = 0; step < 24; step++) {
        const hash = key(child, root);
        if (seen.has(hash)) return undefined;
        seen.add(hash);
        const next = actor(child, root);
        if (!next || boundary(child) || next === root)
          return { ...line, engine: child, score: score(child, root, unitDevelopmentWeight), seen };
        const reply = response(child, next, limit, seen);
        if (!reply) return undefined;
        child = reply;
      }
      return undefined;
    };
    const finished: Line[] = [];
    let frontier: Line[] = [];
    const initialSeen = new Set(history.states);
    for (const first of candidates) {
      const child = apply(engine, root, first, planningLimit);
      if (!child) continue;
      const line = advance(
        { engine: child, first, score: 0, depth: 1, seen: initialSeen },
        planningLimit,
      );
      if (line) (boundary(line.engine) ? finished : frontier).push(line);
    }
    for (let depth = 1; depth < depthLimit && frontier.length && nodes < planningLimit; depth++) {
      const nextLines: Line[] = [];
      for (const line of rank(frontier, width)) {
        for (const action of actions(context(line.engine, root))) {
          const child = apply(line.engine, root, action, planningLimit);
          if (!child) continue;
          const next = advance({ ...line, engine: child, depth: depth + 1 }, planningLimit);
          if (next) (boundary(next.engine) ? finished : nextLines).push(next);
        }
      }
      deepest = depth + 1;
      // Keep the last viable frontier when no deeper line can be expanded.
      if (nextLines.length) frontier = nextLines;
      else break;
    }
    const finalists = rank([...finished, ...frontier], replies);
    const evaluated: Line[] = [];
    for (let index = 0; index < finalists.length; index++) {
      const line = finalists[index]!;
      let child = line.engine;
      const seen = new Set(line.seen);
      // Share remaining work among lines instead of spending it all on the first.
      const limit = nodes + Math.floor((maxNodes - nodes) / (finalists.length - index));
      for (let step = 0; step < 60 && nodes < limit; step++) {
        const next = actor(child, root);
        if (!next) break;
        const view = oracleView(child, root);
        if (boundary(child) && next === root && view.activePlayerId === root) break;
        const reply = response(child, next, limit, seen);
        if (!reply) break;
        child = reply;
        seen.add(key(child, root));
      }
      evaluated.push({ ...line, score: score(child, root, unitDevelopmentWeight) });
    }
    const ranked = rank(evaluated, replies);
    const best = ranked[0];
    if (!best) {
      return ctx.prompt.choice
        ? runResolver(ctx.prompt.choice, greedyStrategy, ctx)
        : greedyStrategy.decideAction(ctx);
    }
    return {
      ...best.first,
      diagnostics: {
        strategy: "expert-oracle",
        candidateCount: candidates.length,
        nodesEvaluated: nodes,
        depthReached: Math.max(1, deepest),
        scoreGap: ranked[1] ? best.score - ranked[1].score : null,
        cutoffReason:
          nodes >= planningLimit ? "node-budget" : deepest >= depthLimit ? "depth" : "complete",
      },
    };
  };
  return {
    name: "expert-oracle",
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

export const expertOracleStrategy = createExpertOracleStrategy();
