import type { FabCommandHandlers } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import { handleActivate } from "./activate.ts";
import { handleAnswerDecision } from "./answer-decision.ts";
import { handleArmPriorityHold } from "./arm-priority-hold.ts";
import { handleBeginPlay } from "./begin-play.ts";
import { handleConcede } from "./concede.ts";
import { handleDefend } from "./defend.ts";
import { handleEndTurn } from "./end-turn.ts";
import { handlePass } from "./pass.ts";
import { handleSetOptionalTriggerAutomation } from "./set-optional-trigger-automation.ts";
import { handleSetAutomationPreferences } from "./set-automation-preferences.ts";

export function createFabCommandHandlers(
  context: FabCommandHandlerContext,
): FabCommandHandlers<FabCommandHandlerResult> {
  return {
    "begin-play": (actorId, command) => handleBeginPlay(context, actorId, command),
    "set-optional-trigger-automation": (actorId, command) =>
      handleSetOptionalTriggerAutomation(context, actorId, command),
    "set-automation-preferences": (actorId, command) =>
      handleSetAutomationPreferences(context, actorId, command),
    "arm-priority-hold": (actorId, command) => handleArmPriorityHold(context, actorId, command),
    "answer-decision": (actorId, command) => handleAnswerDecision(context, actorId, command),
    activate: (actorId, command) => handleActivate(context, actorId, command),
    defend: (actorId, command) => handleDefend(context, actorId, command),
    pass: (actorId, command) => handlePass(context, actorId, command),
    "end-turn": (actorId, command) => handleEndTurn(context, actorId, command),
    concede: (actorId, command) => handleConcede(context, actorId, command),
  };
}
