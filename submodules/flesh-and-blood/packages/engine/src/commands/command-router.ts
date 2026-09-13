import type { FabCommand, FabMoveName } from "../moves.ts";

/** The command variant belonging to one canonical FAB move. */
export type FabCommandFor<Move extends FabMoveName> = Extract<FabCommand, { readonly move: Move }>;

/**
 * Every canonical command must have exactly one typed handler.
 *
 * Adding a move to `FabCommand` breaks this table at compile time until the
 * runtime owner supplies its handler. Handlers receive the narrowed command,
 * so they cannot accidentally inspect payload fields owned by another move.
 */
export type FabCommandHandlers<Result> = {
  readonly [Move in FabMoveName]: (actorId: string, command: FabCommandFor<Move>) => Result;
};

/** Dispatch one decoded FAB command through the complete handler table. */
export function routeFabCommand<Result>(
  handlers: FabCommandHandlers<Result>,
  actorId: string,
  command: FabCommand,
): Result {
  switch (command.move) {
    case "begin-play":
      return handlers["begin-play"](actorId, command);
    case "set-optional-trigger-automation":
      return handlers["set-optional-trigger-automation"](actorId, command);
    case "set-automation-preferences":
      return handlers["set-automation-preferences"](actorId, command);
    case "arm-priority-hold":
      return handlers["arm-priority-hold"](actorId, command);
    case "answer-decision":
      return handlers["answer-decision"](actorId, command);
    case "activate":
      return handlers.activate(actorId, command);
    case "defend":
      return handlers.defend(actorId, command);
    case "pass":
      return handlers.pass(actorId, command);
    case "end-turn":
      return handlers["end-turn"](actorId, command);
    case "concede":
      return handlers.concede(actorId, command);
    default: {
      const exhaustiveCommand: never = command;
      return exhaustiveCommand;
    }
  }
}
