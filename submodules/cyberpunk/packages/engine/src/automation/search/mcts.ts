import type { PlayerId } from "../../types/branded.ts";
import type { CommandEnvelope } from "../../types/commands.ts";
import type { AIStrategy, EngineHandle, MoveDecision } from "../types.ts";
import { greedyStrategy } from "../strategies/greedy.ts";
import { randomStrategy } from "../strategies/random.ts";
import { enumerateCandidateActions, runRollout } from "./shared.ts";

/**
 * UCB1 / MCTS proper. Maintains a search tree across iterations within a
 * single decision: select via UCB1 → expand one untried action → simulate
 * via rollout → backpropagate the result up the tree. After the iteration
 * budget, picks the root child with the highest visit count (more robust
 * than highest win-rate at low visit counts).
 *
 * Two-player flavour: each node tracks `playerToMove` and `rewards` keyed
 * by player id, so UCB1 selection optimises from the parent's perspective
 * and the rollout result correctly credits the winning side regardless of
 * which player owns the node.
 *
 * Boundary-clean: only uses `EngineHandle` (filtered view + prompt +
 * processCommand + fork) — never raw `MatchState`.
 */
export interface MctsOptions {
  /** Total iterations of select/expand/simulate/backprop per decision. Default 50. */
  iterations?: number;
  /** UCB1 exploration constant (often called C). Default sqrt(2). */
  explorationConstant?: number;
  /** Hard cap on rollout depth so an unwinnable position doesn't hang. */
  maxRolloutSteps?: number;
  /**
   * Strategy used to drive both players during rollouts. Defaults to
   * `randomStrategy` for speed — switch to `greedyStrategy` for sharper
   * win-rate signal at the cost of much slower rollouts.
   */
  rolloutStrategy?: AIStrategy;
}

interface MctsNode {
  /** Engine state at this node (already has the parent's action applied). */
  engine: EngineHandle;
  /** Whoever the engine is prompting next; null when the game has ended. */
  playerToMove: PlayerId | null;
  parent: MctsNode | null;
  /** The decision that led from `parent` to this node. */
  actionFromParent: (MoveDecision & { kind: "command" }) | null;
  /** Legal actions not yet expanded into children. */
  untriedActions: (MoveDecision & { kind: "command" })[];
  children: MctsNode[];
  visits: number;
  /** Win count keyed by player id. Updated during backprop. */
  rewards: Map<string, number>;
}

/**
 * Per-engine cache so search work isn't thrown away between turns. Keyed by
 * the live `EngineHandle` (a real player would also retain context between
 * decisions). When a match ends and the engine is GC'd, the cache entry is
 * collected automatically.
 */
interface PersistentCache {
  /** The chosen child from the previous decision; descendants may match the live state on next call. */
  lastChild: MctsNode | null;
}

export function createMctsStrategy(opts: MctsOptions = {}): AIStrategy {
  const iterations = opts.iterations ?? 50;
  const explorationConstant = opts.explorationConstant ?? Math.sqrt(2);
  const maxRolloutSteps = opts.maxRolloutSteps ?? 200;
  const rolloutStrategy = opts.rolloutStrategy ?? randomStrategy;

  // Per-instance cache. Each `createMctsStrategy()` call gets its own
  // WeakMap so two concurrent matches sharing the same factory output (or
  // the singleton `mctsStrategy`) don't corrupt each other's trees. The
  // map is keyed by the live engine, which is unique per match.
  const cache = new WeakMap<EngineHandle, PersistentCache>();

  return {
    name: `mcts:${rolloutStrategy.name}`,
    decideAction(ctx) {
      if (!ctx.engine) {
        return { kind: "stuck", reason: "mcts: requires ctx.engine" };
      }
      // Trivial cases: avoid spinning up a tree when there's nothing to
      // search over.
      const rootActions = enumerateCandidateActions(ctx.prompt);
      if (rootActions.length === 0) return { kind: "stuck", reason: "no actionable moves" };
      if (rootActions.length === 1) return rootActions[0]!;

      // Try to reuse a subtree from the previous decision. If we find a
      // descendant of `lastChild` whose stateID matches the live engine
      // (and where it's our turn to act), inherit its accumulated visits
      // and continue iterating from there. Otherwise fall back to a fresh
      // root.
      const liveStateID = ctx.engine.getFilteredView(ctx.playerId).stateID;
      const entry = cache.get(ctx.engine);
      let root: MctsNode | null = null;
      if (entry?.lastChild) {
        root = findResumePoint(entry.lastChild, liveStateID, ctx.playerId);
      }
      if (root) {
        // Detach from the old parent so backprop stops at the new root.
        root.parent = null;
        root.actionFromParent = null;
      } else {
        root = {
          engine: ctx.engine.fork(),
          playerToMove: ctx.playerId,
          parent: null,
          actionFromParent: null,
          untriedActions: rootActions,
          children: [],
          visits: 0,
          rewards: new Map(),
        };
      }

      // Run additional iterations only — if the inherited root already has
      // visits ≥ iterations, we still run one more pass to refresh the
      // selection but skip most of the work.
      const additional = Math.max(1, iterations - root.visits);
      for (let i = 0; i < additional; i++) {
        // 1. Selection: descend via UCB1 until we hit a node with untried
        //    actions OR a terminal node.
        let node = root;
        while (node.untriedActions.length === 0 && node.children.length > 0) {
          const next = ucbSelect(node, explorationConstant);
          if (!next) break;
          node = next;
        }

        // 2. Expansion: pop one untried action and create a child node.
        if (node.untriedActions.length > 0 && node.playerToMove !== null) {
          const child = expand(node, ctx.playerId);
          if (child) node = child;
        }

        // 3. Simulation: rollout to game-end from this node's engine state.
        const winner = runRollout(
          node.engine.fork(),
          ctx.playerId,
          rolloutStrategy,
          ctx.rng,
          maxRolloutSteps,
        );

        // 4. Backpropagation.
        backpropagate(node, winner);
      }

      // Pick the most-visited root child. Ties broken by highest win-rate
      // for the deciding player, then by the move id for determinism.
      const ownId = ctx.playerId as string;
      const best = root.children.slice().sort((a, b) => {
        if (a.visits !== b.visits) return b.visits - a.visits;
        const aw = (a.rewards.get(ownId) ?? 0) / Math.max(1, a.visits);
        const bw = (b.rewards.get(ownId) ?? 0) / Math.max(1, b.visits);
        if (aw !== bw) return bw - aw;
        return (a.actionFromParent?.move ?? "").localeCompare(b.actionFromParent?.move ?? "");
      })[0];
      if (!best || !best.actionFromParent) return rootActions[0]!;
      // Persist the chosen child so the next decision can resume from
      // its subtree (whichever descendant matches the live state by then).
      cache.set(ctx.engine, { lastChild: best });
      return best.actionFromParent;
    },
  };
}

/**
 * Walk a stored subtree looking for a descendant whose engine state matches
 * the live `stateID` AND where it's `ourPlayerId`'s turn to act. That node
 * (if found) becomes the new search root; we inherit its accumulated visits
 * and keep iterating instead of throwing the work away.
 *
 * Bounds the search depth for safety — in practice the matching node is
 * usually one or two steps below `lastChild` (our action → opponent action
 * → our turn again).
 */
function findResumePoint(
  node: MctsNode,
  targetStateID: number,
  ourPlayerId: PlayerId,
  maxDepth = 8,
): MctsNode | null {
  if (maxDepth <= 0) return null;
  if (node.playerToMove === ourPlayerId) {
    const view = safeStateID(node, ourPlayerId);
    if (view === targetStateID) return node;
  }
  for (const child of node.children) {
    const found = findResumePoint(child, targetStateID, ourPlayerId, maxDepth - 1);
    if (found) return found;
  }
  return null;
}

function safeStateID(node: MctsNode, viewer: PlayerId): number | null {
  try {
    return node.engine.getFilteredView(viewer).stateID;
  } catch {
    return null;
  }
}

/** Default MCTS: 50 iterations with random rollouts. */
export const mctsStrategy: AIStrategy = createMctsStrategy();

/** MCTS variant: rollouts use greedy for sharper signal at higher per-iter cost. */
export const mctsGreedyStrategy: AIStrategy = createMctsStrategy({
  rolloutStrategy: greedyStrategy,
});

/**
 * Standard UCB1 selection. Picks the child that maximises
 *   `wins[parentPlayer] / visits + C * sqrt(ln(parent.visits) / visits)`
 * from the parent's player-to-move perspective. Untried children would
 * have 0 visits — we ensure expansion happens first elsewhere.
 */
function ucbSelect(parent: MctsNode, c: number): MctsNode | null {
  if (parent.children.length === 0) return null;
  const playerKey = parent.playerToMove ? (parent.playerToMove as string) : null;
  const lnParentVisits = Math.log(Math.max(1, parent.visits));
  let best: { node: MctsNode; score: number } | null = null;
  for (const child of parent.children) {
    if (child.visits === 0) return child; // always prefer unvisited
    const winsForParent = playerKey ? (child.rewards.get(playerKey) ?? 0) : 0;
    const exploitation = winsForParent / child.visits;
    const exploration = c * Math.sqrt(lnParentVisits / child.visits);
    const score = exploitation + exploration;
    if (!best || score > best.score) best = { node: child, score };
  }
  return best?.node ?? null;
}

function expand(node: MctsNode, viewerForPrompt: PlayerId): MctsNode | null {
  const action = node.untriedActions.pop();
  if (!action || node.playerToMove === null) return null;

  const childEngine = node.engine.fork();
  const command: CommandEnvelope = {
    commandID: `mcts-expand-${node.visits}-${node.children.length}`,
    move: action.move,
    input: action.args ? { args: action.args } : undefined,
  };
  const result = childEngine.processCommand(command, node.playerToMove);
  if (!result.success) return null; // shouldn't happen with prompt-derived actions

  const childToMove = whoActsNext(childEngine, viewerForPrompt);
  const childActions = childToMove
    ? enumerateCandidateActions(childEngine.getPrompt(childToMove))
    : [];

  const child: MctsNode = {
    engine: childEngine,
    playerToMove: childToMove,
    parent: node,
    actionFromParent: action,
    untriedActions: childActions,
    children: [],
    visits: 0,
    rewards: new Map(),
  };
  node.children.push(child);
  return child;
}

function backpropagate(leaf: MctsNode, winner: string | null): void {
  let node: MctsNode | null = leaf;
  while (node) {
    node.visits += 1;
    if (winner) {
      node.rewards.set(winner, (node.rewards.get(winner) ?? 0) + 1);
    }
    node = node.parent;
  }
}

/**
 * Identify the player the engine is prompting for input next. Falls back to
 * the supplied viewer if no player has an actionable prompt (game ended or
 * everyone is waiting).
 */
function whoActsNext(engine: EngineHandle, viewer: PlayerId): PlayerId | null {
  const view = engine.getFilteredView(viewer);
  if (view.gameEnded) return null;
  const playerIds = Object.keys(view.players) as PlayerId[];
  // Prefer the engine's active player.
  const ordered = [...playerIds].sort((a, b) => {
    const aActive = (a as string) === view.activePlayerId ? 0 : 1;
    const bActive = (b as string) === view.activePlayerId ? 0 : 1;
    return aActive - bActive;
  });
  for (const pid of ordered) {
    const prompt = engine.getPrompt(pid);
    if (prompt.status === "action" || prompt.status === "choice") return pid;
  }
  return null;
}
