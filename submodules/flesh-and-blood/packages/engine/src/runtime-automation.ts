import type { FabCommandHandlers } from "./commands/command-router.ts";
import type { FabCommandHandlerResult } from "./commands/handler-context.ts";
import { drainFabAutomation, type FabAutomationAction } from "./rules/automation-drain.ts";
import { enumerateFabMoves } from "./runtime-moves.ts";
import type { FabMatchState } from "./state.ts";

/**
 * Drain the engine-owned automation authorities (decision auto-answers,
 * optional-trigger passes, priority passes) to a fixed point inside the
 * current command candidate. Automatic actions commit through the same
 * handlers as player commands; a rejected automatic action is an engine bug
 * and fails the command.
 */
export function drainFabCommandAutomation(
  draft: FabMatchState,
  handlers: FabCommandHandlers<FabCommandHandlerResult>,
): readonly FabAutomationAction[] {
  return drainFabAutomation(
    {
      getState: () => draft,
      getPriorityPlayerId: () => (draft.gameEnded ? undefined : draft.priority?.holderPlayerId),
      enumerateMoves: (actorId) => enumerateFabMoves(draft, actorId),
    },
    (automaticActorId) => {
      const automaticResult = handlers.pass(automaticActorId, { move: "pass" });
      if (!automaticResult.accepted) {
        throw new Error(
          `FAB automatic pass by ${automaticActorId} was rejected: ${automaticResult.error}`,
        );
      }
      return automaticResult;
    },
    (automaticActorId, automaticCommand) => {
      const automaticResult = handlers["answer-decision"](automaticActorId, {
        move: "answer-decision",
        decisionId: automaticCommand.decisionId,
        stateVersion: automaticCommand.stateVersion,
        answer: automaticCommand.answer,
      });
      if (!automaticResult.accepted) {
        throw new Error(
          `FAB automatic decision ${automaticCommand.decisionId} was rejected: ${automaticResult.error}`,
        );
      }
      return automaticResult;
    },
  );
}
