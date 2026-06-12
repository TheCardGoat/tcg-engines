import type { PlayerId } from "../types/branded.ts";
import type { PendingChoiceType } from "../types/match-state.ts";
import type { MoveId } from "../moves/index.ts";
import type { CommandEnvelope, CommandResult } from "../types/commands.ts";
import type { FilteredMatchView } from "../view/filter.ts";
import type { ChoicePrompt, PlayerPrompt } from "../view/player-prompt.ts";

/**
 * Boundary-safe engine surface for search-style strategies that need to
 * simulate actions before committing to them. Exposes only the methods a
 * regular AI player would already call (`getFilteredView`, `getPrompt`,
 * `processCommand`) plus `fork()` for cloning. Notably absent: any access
 * to raw `MatchState` — search strategies still can't peek at hidden
 * information (opponent hand, deck order).
 */
export interface EngineHandle {
  getFilteredView(playerId: PlayerId): FilteredMatchView;
  getPrompt(playerId: PlayerId): PlayerPrompt;
  processCommand(command: CommandEnvelope, playerId: PlayerId): CommandResult;
  fork(): EngineHandle;
}

/**
 * The output of a strategy or resolver. Either an executable command or a
 * deliberate "I cannot decide" signal that the driver surfaces upward without
 * crashing the match loop.
 */
export type MoveDecision =
  | { kind: "command"; move: MoveId; args?: Record<string, unknown> }
  | { kind: "stuck"; reason: string };

/**
 * Everything a strategy or resolver is allowed to look at. Notably absent:
 * any reference to the raw `MatchState`, the effect bag, the trigger queue,
 * opponent hand contents, or deck contents. A real human player sees the
 * exact same data.
 */
export interface DecisionContext {
  view: FilteredMatchView;
  playerId: PlayerId;
  prompt: PlayerPrompt;
  rng: () => number;
  /**
   * Optional boundary-safe engine handle for search-style strategies.
   * Pure-view strategies (firstLegal/random/greedy) ignore this; strategies
   * that need to simulate actions (Monte Carlo, MCTS) read it to fork the
   * engine and run rollouts. The driver populates it from the live engine.
   */
  engine?: EngineHandle;
}

/**
 * Resolves one variant of a player-facing pending choice into a command.
 * Default implementations live in `automation/resolvers`; strategies can
 * override individual variants via {@link AIStrategy.decideChoice}.
 */
export type ChoiceResolver<TPrompt extends ChoicePrompt> = (
  choice: TPrompt,
  ctx: DecisionContext,
) => MoveDecision;

/**
 * Mapped over {@link PendingChoiceType} so the harness fails to compile if a
 * new pending-choice variant is introduced without a matching resolver.
 */
export type ChoiceResolverMap = {
  [K in PendingChoiceType]: ChoiceResolver<Extract<ChoicePrompt, { type: K }>>;
};

/**
 * A pluggable AI player. Strategies must implement `decideAction`; effect
 * resolution defaults to the shared decision tree unless individual variants
 * are overridden via `decideChoice`.
 */
export interface AIStrategy {
  name: string;
  decideAction(ctx: DecisionContext): MoveDecision;
  decideChoice?: Partial<ChoiceResolverMap>;
}

export interface StepResultActed {
  kind: "acted";
  decision: MoveDecision & { kind: "command" };
  result: CommandResult;
  stateID: number;
}

export interface StepResultIdle {
  kind: "idle";
  reason: "gameEnded" | "waiting" | "noMoves";
}

export interface StepResultStuck {
  kind: "stuck";
  reason: string;
  pendingType?: PendingChoiceType;
}

export interface StepResultIllegal {
  kind: "illegal";
  decision: MoveDecision & { kind: "command" };
  error: string;
  errorCode: string;
}

export type StepResult = StepResultActed | StepResultIdle | StepResultStuck | StepResultIllegal;

export interface TurnResult {
  steps: StepResult[];
  endedReason: "gameEnded" | "waiting" | "stuck" | "illegal" | "maxSteps" | "noMoves";
}
