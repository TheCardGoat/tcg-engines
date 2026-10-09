import { resolveStartOfGameStage } from "./setup-effects.ts";
import { withEffectTriggerEvent } from "../effects/trigger-context.ts";
import { withReplacementProcess } from "../effects/replacement-process.ts";
import { emitEvent, emitLog } from "../shared.ts";
import type { EngineCommand, MatchSeat, MatchState } from "../types.ts";
import { findPendingPrompt } from "../state.ts";
import { resolvePrompt as resolveBattlePrompt } from "../battle.ts";
import { resolveEffectChoicePrompt } from "../effects.ts";
import { resolveCharacterReplacementPrompt } from "./play.ts";

export function handlePlayerPromptResolution(
  state: MatchState,
  command: Extract<EngineCommand, { type: "resolvePrompt"; seat: MatchSeat }>,
): boolean {
  const prompt = findPendingPrompt(state, command.promptId);
  if (!prompt || prompt.seat !== command.seat) {
    emitEvent(state, "commandRejected", command.seat, {
      visibility: "public",
      data: {
        reason: "Prompt not available.",
      },
    });
    emitLog(state, command.seat, "Prompt resolution was rejected.", {
      visibility: "public",
    });
    return false;
  }

  prompt.status = "resolved";

  const accepted = withReplacementProcess(state, prompt.replacementProcess, () =>
    withEffectTriggerEvent(state, prompt.effectTriggerEvent, () => {
      if (
        prompt.resolutionContext?.intent === "startOfGameStage" ||
        prompt.resolutionContext?.intent === "startOfGameSearch"
      ) {
        return resolveStartOfGameStage(state, prompt, command);
      }
      if (resolveCharacterReplacementPrompt(state, prompt, command)) {
        return true;
      }

      if (resolveEffectChoicePrompt(state, prompt, command)) {
        return true;
      }

      return resolveBattlePrompt(state, command);
    }),
  );
  if (!accepted) {
    prompt.status = "pending";
    return false;
  }
  emitEvent(state, "promptResolved", command.seat, {
    sourceCardId: prompt.sourceCardId,
    sourceInstanceId: prompt.sourceInstanceId,
    eventId: prompt.eventId,
    visibility: "public",
    data: {
      promptId: prompt.id,
    },
  });
  return true;
}
