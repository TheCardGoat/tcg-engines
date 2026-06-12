import { emitEvent, emitLog, getInstance, getPlayer } from "./shared.ts";
import { findPendingPrompt, moveCard } from "./state.ts";
import type { JudgeCommand, MatchState } from "./types.ts";

export function applyJudgeCommand(state: MatchState, command: JudgeCommand): boolean {
  switch (command.type) {
    case "judgeResolvePrompt": {
      const prompt = findPendingPrompt(state, command.promptId);
      if (!prompt) {
        return false;
      }
      prompt.status = "resolved";
      emitEvent(state, "promptResolved", "judge", {
        sourceCardId: prompt.sourceCardId,
        sourceInstanceId: prompt.sourceInstanceId,
        eventId: prompt.eventId,
        visibility: "judge",
        data: {
          promptId: prompt.id,
        },
      });
      emitLog(state, "judge", command.note, {
        sourceCardId: prompt.sourceCardId,
        sourceInstanceId: prompt.sourceInstanceId,
        eventId: prompt.eventId,
        visibility: "judge",
        judgeMessage: command.note,
      });
      return true;
    }
    case "judgeMoveCard": {
      moveCard(state, command.instanceId, command.owner, command.zone, {
        slotIndex: command.slotIndex,
        deckPosition: command.deckPosition,
        faceUp: command.zone !== "deck" && command.zone !== "hand" && command.zone !== "life",
        publicKnowledge:
          command.zone === "trash" || command.zone === "character" || command.zone === "stage",
        actor: "judge",
        visibility: "judge",
      });
      emitEvent(state, "judgeAction", "judge", {
        sourceCardId: getInstance(state, command.instanceId).cardId,
        sourceInstanceId: command.instanceId,
        visibility: "judge",
        data: {
          zone: command.zone,
        },
      });
      emitLog(state, "judge", command.note ?? "Judge moved a card.", {
        sourceCardId: getInstance(state, command.instanceId).cardId,
        sourceInstanceId: command.instanceId,
        visibility: "judge",
        judgeMessage: command.note ?? "Judge moved a card.",
      });
      return true;
    }
    case "judgeSetWinner":
      state.status = "finished";
      state.phase = "finished";
      state.winner = command.winner;
      emitEvent(state, "winnerDeclared", "judge", {
        visibility: "judge",
        data: {
          winner: command.winner,
        },
      });
      emitLog(
        state,
        "judge",
        command.note ?? `${getPlayer(state, command.winner).playerName} is declared the winner.`,
        {
          visibility: "judge",
          judgeMessage:
            command.note ??
            `${getPlayer(state, command.winner).playerName} is declared the winner.`,
        },
      );
      return true;
  }
}
