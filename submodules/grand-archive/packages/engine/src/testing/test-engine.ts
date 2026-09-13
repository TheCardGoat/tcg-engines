import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import type { GrandArchiveCommand } from "../commands/commands.ts";
import { grandArchivePlayerId } from "../game/identity.ts";
import type { GrandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveInitializeOptions,
  type InitializeGrandArchiveMatchInput,
} from "../procedures/game-flow/initialize.ts";
import {
  listGrandArchiveLegalCommands,
  type GrandArchiveLegalCommand,
  type ListGrandArchiveLegalCommandsOptions,
} from "../commands/legal-commands.ts";
import {
  createGrandArchiveMatchProgram,
  type GrandArchiveMatchProgram,
} from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";
import {
  GrandArchiveMatchRuntime,
  type GrandArchiveCommandFailure,
  type GrandArchiveCommandSuccess,
  type GrandArchiveCommandTransition,
} from "../procedures/game-flow/runtime.ts";
import {
  projectGrandArchiveViewerState,
  type GrandArchiveViewerState,
} from "../projection/view.ts";
import type { GrandArchiveWaitState } from "../projection/wait-state.ts";
import {
  isGrandArchiveCardInstanceRef,
  listGrandArchiveCardRefs,
  resolveGrandArchiveCardRef,
  type GrandArchiveCardRefFilter,
  type GrandArchiveCardInstanceRef,
  type GrandArchiveTestCardRef,
} from "./card-ref.ts";
import { GrandArchivePlayerHandle } from "./player-handle.ts";
import { buildGrandArchiveTestFixture, type GrandArchiveTestFixture } from "./test-fixture.ts";

export class GrandArchiveMoveFailedError extends Error {
  public constructor(
    public readonly playerId: GrandArchivePlayerId,
    public readonly command: GrandArchiveCommand,
    public readonly failure: GrandArchiveCommandFailure,
  ) {
    super(`Grand Archive move ${command.move} by ${playerId} failed: ${failure.message}`);
    this.name = "GrandArchiveMoveFailedError";
  }
}

export class GrandArchiveLegalCommandSelectionError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "GrandArchiveLegalCommandSelectionError";
  }
}

export type GrandArchiveStackDrainStop =
  | "stack-empty"
  | "decision"
  | "player-choice"
  | "match-finished";

/**
 * Intent-level test driver for the production Grand Archive runtime.
 *
 * The harness does not implement rules: initialization, legality, commands,
 * decisions, event stabilization, and projections all use production paths.
 */
export class GrandArchiveTestEngine {
  private constructor(private readonly runtime: GrandArchiveMatchRuntime) {}

  public static start(
    cards: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
    input: InitializeGrandArchiveMatchInput,
    options: GrandArchiveInitializeOptions = {},
  ): GrandArchiveTestEngine {
    const program = createGrandArchiveMatchProgram(cards);
    const state = createGrandArchiveMatchInitialState(program, input, options);
    return new GrandArchiveTestEngine(new GrandArchiveMatchRuntime(program, state));
  }

  /** Start a concise deterministic fixture intended for card-local acceptance tests. */
  public static startFixture(fixture: GrandArchiveTestFixture): GrandArchiveTestEngine {
    const built = buildGrandArchiveTestFixture(fixture);
    return GrandArchiveTestEngine.fromState(built.program, built.state);
  }

  public static fromState(
    program: GrandArchiveMatchProgram,
    state: GrandArchiveMatchState,
  ): GrandArchiveTestEngine {
    return new GrandArchiveTestEngine(new GrandArchiveMatchRuntime(program, state));
  }

  public static fromRuntime(runtime: GrandArchiveMatchRuntime): GrandArchiveTestEngine {
    return new GrandArchiveTestEngine(runtime);
  }

  public get state(): GrandArchiveMatchState {
    return this.runtime.state;
  }

  public get program(): GrandArchiveMatchProgram {
    return this.runtime.program;
  }

  public waitState(): GrandArchiveWaitState {
    return this.runtime.waitState();
  }

  public player(playerId: string | GrandArchivePlayerId): GrandArchivePlayerHandle {
    const id = grandArchivePlayerId(playerId);
    if (!this.state.players[id]) throw new Error(`Unknown Grand Archive player ${id}.`);
    return new GrandArchivePlayerHandle(this, id);
  }

  public view(playerId: GrandArchivePlayerId): GrandArchiveViewerState {
    return projectGrandArchiveViewerState(this.program, this.state, playerId);
  }

  public card(
    playerId: GrandArchivePlayerId,
    ref: GrandArchiveTestCardRef,
    filter: GrandArchiveCardRefFilter = {},
  ): GrandArchiveCardInstanceRef {
    return resolveGrandArchiveCardRef(this.state, playerId, ref, filter);
  }

  public cards(
    playerId: GrandArchivePlayerId,
    ref: GrandArchiveTestCardRef,
    filter: GrandArchiveCardRefFilter = {},
  ): readonly GrandArchiveCardInstanceRef[] {
    if (isGrandArchiveCardInstanceRef(ref)) {
      if (ref.ownerId !== playerId) return [];
      return [resolveGrandArchiveCardRef(this.state, playerId, ref, filter)];
    }
    return listGrandArchiveCardRefs(this.state, playerId, ref, filter);
  }

  public zone(
    playerId: GrandArchivePlayerId,
    zone: import("@tcg/grand-archive-types").GrandArchiveZone,
  ): readonly GrandArchiveCardInstanceRef[] {
    return this.state.zones[playerId][zone].map((objectId) => {
      const object = this.state.objects[objectId];
      if (!object) throw new Error(`Missing Grand Archive object ${objectId}.`);
      return {
        kind: "instance" as const,
        objectId,
        definitionId: object.definitionId,
        ownerId: object.ownerId,
      };
    });
  }

  public cardAcrossPlayers(
    ref: GrandArchiveTestCardRef,
    filter: GrandArchiveCardRefFilter = {},
  ): GrandArchiveCardInstanceRef {
    const matches = Object.keys(this.state.players).flatMap((playerId) =>
      this.cards(grandArchivePlayerId(playerId), ref, filter),
    );
    if (matches.length !== 1) {
      throw new Error(`Expected one Grand Archive card across players; found ${matches.length}.`);
    }
    return matches[0]!;
  }

  public legalCommands(
    playerId: GrandArchivePlayerId,
    options: ListGrandArchiveLegalCommandsOptions = {},
  ): readonly GrandArchiveLegalCommand[] {
    return listGrandArchiveLegalCommands(this.program, this.state, playerId, options);
  }

  /** Resolve one player intent to exactly one production-enumerated command. */
  public uniqueLegalCommand(
    playerId: GrandArchivePlayerId,
    predicate: (candidate: GrandArchiveLegalCommand) => boolean,
    description = "requested command",
  ): GrandArchiveLegalCommand {
    const matches = this.legalCommands(playerId).filter(predicate);
    if (matches.length !== 1) {
      throw new GrandArchiveLegalCommandSelectionError(
        `${description} matched ${matches.length} legal commands for ${playerId}.`,
      );
    }
    return matches[0]!;
  }

  /** Execute exactly one command selected from production legality. */
  public executeLegal(
    playerId: GrandArchivePlayerId,
    predicate: (candidate: GrandArchiveLegalCommand) => boolean,
    description?: string,
  ): GrandArchiveCommandSuccess {
    return this.execute(
      playerId,
      this.uniqueLegalCommand(playerId, predicate, description).command,
    );
  }

  /**
   * Answer only when the pending decision has one legal answer. A meaningful
   * choice is left pending for the test or simulator driver.
   */
  public answerForcedDecision(): boolean {
    const decision = this.state.decision;
    if (!decision) return false;
    const answers = this.legalCommands(decision.playerId).filter(
      (candidate) => candidate.command.move === "answer-decision",
    );
    if (answers.length !== 1) return false;
    this.execute(decision.playerId, answers[0]!.command);
    return true;
  }

  /**
   * Pass response windows while the Effects Stack is non-empty and no player
   * has another legal action. Forced decisions are answered; choices stop the drain.
   */
  public resolveStackUntilChoice(maxSteps = 128): GrandArchiveStackDrainStop {
    if (!Number.isSafeInteger(maxSteps) || maxSteps < 1) {
      throw new Error("Grand Archive stack drain maxSteps must be a positive safe integer.");
    }
    for (let step = 0; step < maxSteps; step += 1) {
      const wait = this.waitState();
      if (wait.kind === "game-over") return "match-finished";
      if (wait.kind === "decision") {
        if (this.answerForcedDecision()) continue;
        return "decision";
      }
      if (this.state.stack.length === 0) return "stack-empty";
      if (wait.kind !== "opportunity") {
        throw new Error("A non-empty Grand Archive stack has no Opportunity holder.");
      }
      const holderId = wait.playerId;
      const legal = this.legalCommands(holderId);
      const pass = legal.filter((candidate) => candidate.command.move === "pass");
      const actions = legal.filter((candidate) => candidate.command.move !== "pass");
      if (actions.length > 0) return "player-choice";
      if (pass.length !== 1) {
        throw new Error(
          `Expected one legal pass for ${holderId} while resolving the Effects Stack; found ${pass.length}.`,
        );
      }
      this.execute(holderId, pass[0]!.command);
    }
    throw new Error(`Grand Archive stack drain exceeded ${maxSteps} steps.`);
  }

  /** Passes combat windows and declines every optional retaliation. */
  public resolveCombatWithoutRetaliation(maxSteps = 64): void {
    if (!Number.isSafeInteger(maxSteps) || maxSteps < 1) {
      throw new Error("Grand Archive combat drain maxSteps must be a positive safe integer.");
    }
    for (let step = 0; step < maxSteps; step += 1) {
      if (!this.state.combat) return;
      const wait = this.waitState();
      if (wait.kind === "decision") {
        if (this.state.decision?.kind !== "choose-retaliators") {
          throw new Error(
            `Combat drain stopped at unsupported decision ${this.state.decision?.kind ?? "unknown"}.`,
          );
        }
        this.execute(wait.playerId, {
          move: "answer-decision",
          decisionId: this.state.decision.id,
          stateVersion: this.state.decision.stateVersion,
          answer: [],
        });
        continue;
      }
      if (wait.kind !== "opportunity") {
        throw new Error(`Combat drain stopped at ${wait.kind}.`);
      }
      this.player(wait.playerId).pass();
    }
    throw new Error(`Grand Archive combat drain exceeded ${maxSteps} steps.`);
  }

  public tryExecute(
    playerId: GrandArchivePlayerId,
    command: GrandArchiveCommand,
  ): GrandArchiveCommandTransition {
    return this.runtime.execute(command, {
      playerId,
      expectedStateVersion: this.state.stateVersion,
    });
  }

  /**
   * Probe a command that must fail against an isolated production runtime.
   * Neither an expected rejection nor an unexpectedly accepted probe can
   * mutate the match held by this test engine.
   */
  public expectFailure(
    playerId: GrandArchivePlayerId,
    command: GrandArchiveCommand,
  ): GrandArchiveCommandFailure {
    const probe = new GrandArchiveMatchRuntime(this.program, this.state);
    const result = probe.execute(command, {
      playerId,
      expectedStateVersion: this.state.stateVersion,
    });
    if (result.ok) {
      throw new Error(
        `Expected Grand Archive move ${command.move} by ${playerId} to fail, but it was accepted.`,
      );
    }
    return result;
  }

  public execute(
    playerId: GrandArchivePlayerId,
    command: GrandArchiveCommand,
  ): GrandArchiveCommandSuccess {
    const result = this.tryExecute(playerId, command);
    if (!result.ok) throw new GrandArchiveMoveFailedError(playerId, command, result);
    return result;
  }
}
