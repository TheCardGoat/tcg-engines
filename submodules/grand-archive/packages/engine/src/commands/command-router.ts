import type { GrandArchiveCommand, GrandArchiveMoveName } from "./commands.ts";
import type { GrandArchivePlayerId } from "../game/identity.ts";

/** The command variant belonging to one canonical Grand Archive move. */
export type GrandArchiveCommandFor<Move extends GrandArchiveMoveName> = Extract<
  GrandArchiveCommand,
  { readonly move: Move }
>;

/**
 * Every canonical command must have exactly one typed runtime handler.
 *
 * Adding a move breaks this table at compile time until the runtime supplies a
 * handler. Each handler receives only its narrowed command payload.
 */
export type GrandArchiveCommandHandlers<Result> = {
  readonly [Move in GrandArchiveMoveName]: (
    playerId: GrandArchivePlayerId,
    command: GrandArchiveCommandFor<Move>,
  ) => Result;
};

/** Dispatch one admitted Grand Archive command through the complete handler table. */
export function routeGrandArchiveCommand<Result>(
  handlers: GrandArchiveCommandHandlers<Result>,
  playerId: GrandArchivePlayerId,
  command: GrandArchiveCommand,
): Result {
  switch (command.move) {
    case "pass":
      return handlers.pass(playerId, command);
    case "concede":
      return handlers.concede(playerId, command);
    case "skip-materialization":
      return handlers["skip-materialization"](playerId, command);
    case "return-preserved-card":
      return handlers["return-preserved-card"](playerId, command);
    case "materialize":
      return handlers.materialize(playerId, command);
    case "bestow-boon":
      return handlers["bestow-boon"](playerId, command);
    case "start-pregame-card":
      return handlers["start-pregame-card"](playerId, command);
    case "complete-pregame-actions":
      return handlers["complete-pregame-actions"](playerId, command);
    case "activate-card":
      return handlers["activate-card"](playerId, command);
    case "activate-ability":
      return handlers["activate-ability"](playerId, command);
    case "declare-attack":
      return handlers["declare-attack"](playerId, command);
    case "answer-decision":
      return handlers["answer-decision"](playerId, command);
    default: {
      const exhaustiveCommand: never = command;
      return exhaustiveCommand;
    }
  }
}
