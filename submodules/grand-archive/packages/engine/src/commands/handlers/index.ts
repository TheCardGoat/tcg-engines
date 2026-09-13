import type { GrandArchiveCommandHandlers } from "../command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";
import { handleGrandArchiveActivateAbility } from "./activate-ability.ts";
import { handleGrandArchiveActivateCard } from "./activate-card.ts";
import { handleGrandArchiveAnswerDecision } from "./answer-decision.ts";
import { handleGrandArchiveBestowBoon } from "./bestow-boon.ts";
import { handleGrandArchiveCompletePregameActions } from "./complete-pregame-actions.ts";
import { handleGrandArchiveConcede } from "./concede.ts";
import { handleGrandArchiveDeclareAttack } from "./declare-attack.ts";
import { handleGrandArchiveMaterialize } from "./materialize.ts";
import { handleGrandArchivePass } from "./pass.ts";
import { handleGrandArchiveReturnPreservedCard } from "./return-preserved-card.ts";
import { handleGrandArchiveSkipMaterialization } from "./skip-materialization.ts";
import { handleGrandArchiveStartPregameCard } from "./start-pregame-card.ts";

/** Complete typed command-handler table owned by the command layer. */
export function createGrandArchiveCommandHandlers(
  context: GrandArchiveCommandHandlerContext,
): GrandArchiveCommandHandlers<GrandArchiveCommandTransition> {
  return {
    pass: (playerId, command) => handleGrandArchivePass(context, playerId, command),
    concede: (playerId, command) => handleGrandArchiveConcede(context, playerId, command),
    "skip-materialization": (playerId, command) =>
      handleGrandArchiveSkipMaterialization(context, playerId, command),
    "return-preserved-card": (playerId, command) =>
      handleGrandArchiveReturnPreservedCard(context, playerId, command),
    materialize: (playerId, command) => handleGrandArchiveMaterialize(context, playerId, command),
    "bestow-boon": (playerId, command) => handleGrandArchiveBestowBoon(context, playerId, command),
    "start-pregame-card": (playerId, command) =>
      handleGrandArchiveStartPregameCard(context, playerId, command),
    "complete-pregame-actions": (playerId, command) =>
      handleGrandArchiveCompletePregameActions(context, playerId, command),
    "activate-card": (playerId, command) =>
      handleGrandArchiveActivateCard(context, playerId, command),
    "activate-ability": (playerId, command) =>
      handleGrandArchiveActivateAbility(context, playerId, command),
    "declare-attack": (playerId, command) =>
      handleGrandArchiveDeclareAttack(context, playerId, command),
    "answer-decision": (playerId, command) =>
      handleGrandArchiveAnswerDecision(context, playerId, command),
  };
}
