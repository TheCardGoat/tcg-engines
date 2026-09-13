import type { GrandArchivePlayerId } from "../game/identity.ts";
import {
  listGrandArchiveLegalCommands,
  type GrandArchiveLegalCommand,
  type ListGrandArchiveLegalCommandsOptions,
} from "../commands/legal-commands.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";
import type {
  GrandArchiveCommandTransition,
  GrandArchiveMatchRuntime,
} from "../procedures/game-flow/runtime.ts";

export interface GrandArchiveBotDecisionContext {
  readonly program: GrandArchiveMatchProgram;
  readonly state: GrandArchiveMatchState;
  readonly playerId: GrandArchivePlayerId;
  readonly legalCommands: readonly GrandArchiveLegalCommand[];
}

export type GrandArchiveBotStrategy = (
  context: GrandArchiveBotDecisionContext,
) => GrandArchiveLegalCommand | null;

export type SubmitGrandArchiveAutomatedActionResult =
  | {
      readonly kind: "idle";
      readonly command: null;
      readonly transition: null;
    }
  | {
      readonly kind: "strategy-command-not-legal";
      readonly command: null;
      readonly transition: null;
    }
  | {
      readonly kind: "submitted";
      readonly command: GrandArchiveLegalCommand;
      readonly transition: GrandArchiveCommandTransition;
    };

function commandPriority(candidate: GrandArchiveLegalCommand): number {
  switch (candidate.command.move) {
    case "answer-decision":
      return 0;
    case "return-preserved-card":
    case "materialize":
    case "skip-materialization":
    case "start-pregame-card":
    case "complete-pregame-actions":
      return 1;
    case "activate-ability":
    case "activate-card":
    case "bestow-boon":
    case "declare-attack":
      return 2;
    case "pass":
      return 3;
    case "concede":
      return 4;
    default:
      return assertNever(candidate.command);
  }
}

/** Chooses the first deterministic progress command, preferring mandatory decisions. */
export const firstLegalGrandArchiveStrategy: GrandArchiveBotStrategy = ({ legalCommands }) =>
  [...legalCommands].sort((left, right) => commandPriority(left) - commandPriority(right))[0] ??
  null;

/** A conservative policy that answers mandatory prompts and otherwise passes or skips. */
export const passOnlyGrandArchiveStrategy: GrandArchiveBotStrategy = ({ legalCommands }) =>
  legalCommands.find((candidate) => candidate.command.move === "answer-decision") ??
  legalCommands.find((candidate) => candidate.command.move === "pass") ??
  legalCommands.find((candidate) => candidate.command.move === "skip-materialization") ??
  legalCommands.find((candidate) => candidate.command.move === "complete-pregame-actions") ??
  null;

/** Deterministic pseudo-random policy for repeatable simulations and bot benches. */
export const deterministicRandomGrandArchiveStrategy: GrandArchiveBotStrategy = ({
  state,
  playerId,
  legalCommands,
}) => {
  if (legalCommands.length === 0) return null;
  let hash = state.stateVersion ^ state.turn.number;
  for (const character of playerId) hash = Math.imul(hash ^ character.charCodeAt(0), 0x45d9f3b);
  return legalCommands[Math.abs(hash) % legalCommands.length] ?? null;
};

export function seatMustActInGrandArchive(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): boolean {
  return listGrandArchiveLegalCommands(program, state, playerId).length > 0;
}

export function chooseGrandArchiveAutomatedAction(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  strategy: GrandArchiveBotStrategy = firstLegalGrandArchiveStrategy,
  options: ListGrandArchiveLegalCommandsOptions = {},
): GrandArchiveLegalCommand | null {
  const legalCommands = listGrandArchiveLegalCommands(program, state, playerId, options);
  return strategy({ program, state, playerId, legalCommands });
}

export function submitGrandArchiveAutomatedAction(
  runtime: GrandArchiveMatchRuntime,
  playerId: GrandArchivePlayerId,
  strategy: GrandArchiveBotStrategy = firstLegalGrandArchiveStrategy,
  options: ListGrandArchiveLegalCommandsOptions = {},
): SubmitGrandArchiveAutomatedActionResult {
  const legalCommands = listGrandArchiveLegalCommands(
    runtime.program,
    runtime.state,
    playerId,
    options,
  );
  const chosen = strategy({
    program: runtime.program,
    state: runtime.state,
    playerId,
    legalCommands,
  });
  if (!chosen) return { kind: "idle", command: null, transition: null };
  const chosenKey = JSON.stringify(chosen.command);
  const command = legalCommands.find(
    (candidate) => JSON.stringify(candidate.command) === chosenKey,
  );
  if (!command) {
    return { kind: "strategy-command-not-legal", command: null, transition: null };
  }
  return {
    kind: "submitted",
    command,
    transition: runtime.execute(command.command, {
      playerId: command.playerId,
      expectedStateVersion: command.stateVersion,
    }),
  };
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive bot command: ${JSON.stringify(value)}`);
}
