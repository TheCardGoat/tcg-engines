import type { LocalEngine } from "../transport/local-engine.ts";
import type { PlayerId } from "../types/branded.ts";
import type { CommandEnvelope, CommandResult } from "../types/commands.ts";
import type { ChoicePrompt, PlayerPromptStatus } from "../view/player-prompt.ts";
import type { AIStrategy, DecisionContext, MoveDecision, StepResult, TurnResult } from "./types.ts";
import { defaultChoiceResolvers } from "./resolvers/index.ts";
import { buildDecisionContext } from "./decision-context.ts";
import { assertNever } from "./util/assert-never.ts";
import { SeededRNG } from "../state/rng.ts";

export interface AIPlayerOptions {
  /** Seed for the strategy's RNG. Defaults to a hash of the player id. */
  rngSeed?: string;
  /** Deterministic command id generator. Defaults to `${playerId}-${stepIndex}`. */
  commandIdFor?: (stepIndex: number) => string;
}

/**
 * Drives a single player using a pluggable strategy. Talks to the engine
 * exclusively through the public {@link LocalEngine} surfaces (`getPrompt`,
 * `getFilteredView`, `processCommand`).
 */
export class AIPlayer {
  readonly playerId: PlayerId;
  readonly strategy: AIStrategy;
  private readonly engine: LocalEngine;
  private readonly rng: SeededRNG;
  private readonly commandIdFor: (stepIndex: number) => string;
  private stepIndex = 0;

  constructor(
    engine: LocalEngine,
    playerId: PlayerId,
    strategy: AIStrategy,
    options: AIPlayerOptions = {},
  ) {
    this.engine = engine;
    this.playerId = playerId;
    this.strategy = strategy;
    this.rng = new SeededRNG(options.rngSeed ?? `ai:${playerId as string}`);
    this.commandIdFor =
      options.commandIdFor ?? ((idx) => `${strategy.name}-${playerId as string}-${idx}`);
  }

  /** Execute exactly one decision. Returns what happened or why we stopped. */
  step(): StepResult {
    const ctx = buildDecisionContext(this.engine, this.playerId, () => this.rng.next());

    if (ctx.view.gameEnded) return { kind: "idle", reason: "gameEnded" };

    const status = ctx.prompt.status as PlayerPromptStatus;
    switch (status) {
      case "idle":
      case "waiting":
        return { kind: "idle", reason: status === "idle" ? "gameEnded" : "waiting" };
      case "choice": {
        const decision = this.decideChoice(ctx);
        return this.dispatch(decision, ctx);
      }
      case "action": {
        if (ctx.prompt.availableMoves.length === 0) {
          return { kind: "idle", reason: "noMoves" };
        }
        const decision = this.strategy.decideAction(ctx);
        return this.dispatch(decision, ctx);
      }
      default:
        return assertNever(status, "PlayerPromptStatus");
    }
  }

  /**
   * Step until the player has no more actionable work this turn (waiting,
   * stuck, gameEnded) or the safety cap is hit.
   */
  takeTurn(opts: { maxSteps?: number } = {}): TurnResult {
    const maxSteps = opts.maxSteps ?? 200;
    const steps: StepResult[] = [];
    for (let i = 0; i < maxSteps; i++) {
      const result = this.step();
      steps.push(result);
      switch (result.kind) {
        case "acted":
          continue;
        case "idle":
          return {
            steps,
            endedReason:
              result.reason === "gameEnded"
                ? "gameEnded"
                : result.reason === "waiting"
                  ? "waiting"
                  : "noMoves",
          };
        case "stuck":
          return { steps, endedReason: "stuck" };
        case "illegal":
          return { steps, endedReason: "illegal" };
        default:
          return assertNever(result, "StepResult");
      }
    }
    return { steps, endedReason: "maxSteps" };
  }

  // ── private ────────────────────────────────────────────────────────────

  private decideChoice(ctx: DecisionContext): MoveDecision {
    const choice = ctx.prompt.choice;
    if (!choice) return { kind: "stuck", reason: "decideChoice: no pending choice" };
    return runResolver(choice, this.strategy, ctx);
  }

  private dispatch(decision: MoveDecision, ctx: DecisionContext): StepResult {
    if (decision.kind === "stuck") {
      return {
        kind: "stuck",
        reason: decision.reason,
        pendingType: ctx.prompt.choice?.type,
      };
    }
    const command: CommandEnvelope = {
      commandID: this.commandIdFor(this.stepIndex++),
      move: decision.move,
      input: decision.args ? { args: decision.args } : undefined,
    };
    const result: CommandResult = this.engine.processCommand(command, this.playerId);
    if (!result.success) {
      return {
        kind: "illegal",
        decision,
        error: result.error,
        errorCode: result.errorCode,
      };
    }
    return { kind: "acted", decision, result, stateID: result.stateID };
  }
}

/**
 * Look up the resolver for a choice variant — strategy override first, then
 * the shared default. Generic over the union so type narrowing inside each
 * resolver is preserved. Exported so search-strategy rollouts can reuse the
 * same dispatch (see `automation/search/shared.ts:runRollout`).
 */
export function runResolver(
  choice: ChoicePrompt,
  strategy: AIStrategy,
  ctx: DecisionContext,
): MoveDecision {
  const overrides = strategy.decideChoice;
  switch (choice.type) {
    case "searchDeck":
      return pick(overrides?.searchDeck, defaultChoiceResolvers.searchDeck)(choice, ctx);
    case "chooseTarget":
      return pick(overrides?.chooseTarget, defaultChoiceResolvers.chooseTarget)(choice, ctx);
    case "chooseEffect":
      return pick(overrides?.chooseEffect, defaultChoiceResolvers.chooseEffect)(choice, ctx);
    case "chooseTrigger":
      return pick(overrides?.chooseTrigger, defaultChoiceResolvers.chooseTrigger)(choice, ctx);
    case "chooseGigsToSteal":
      return pick(overrides?.chooseGigsToSteal, defaultChoiceResolvers.chooseGigsToSteal)(
        choice,
        ctx,
      );
    case "chooseCardToPlay":
      return pick(overrides?.chooseCardToPlay, defaultChoiceResolvers.chooseCardToPlay)(
        choice,
        ctx,
      );
    case "chooseCardToMove":
      return pick(overrides?.chooseCardToMove, defaultChoiceResolvers.chooseCardToMove)(
        choice,
        ctx,
      );
    case "gainGig":
      return pick(overrides?.gainGig, defaultChoiceResolvers.gainGig)(choice, ctx);
    default:
      return assertNever(choice, "ChoicePrompt");
  }
}

function pick<T>(override: T | undefined, fallback: T): T {
  return override ?? fallback;
}
