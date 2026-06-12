/**
 * Deploy Base Move
 *
 * Plays a Base card from hand into the base section of the shield area.
 * Rules 7-5-2-1: deploy a Base by paying its cost.
 * Rules 3-5-1: Base cards are deployed into the base section of the shield area.
 * Rules 4-6-3: You may have up to one Base placed face up in your base section.
 * Rules 3-5-3: While a Base is present, damage dealt to the shield area is
 *              preferentially dealt to that base.
 */

import type { Card } from "@tcg/gundam-types";
import type { GundamMoveDefinition } from "../../types.ts";
import {
  validatePlayFromHand,
  validateDeployTriggerTargets,
  payCardCost,
} from "./play-card-shared.ts";
import {
  enqueueMoveCompletionFence,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../../effects/pending-effects.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";

export const deployBase: GundamMoveDefinition<"deployBase"> = {
  gatedByPendingEffects: true,

  enumerateCandidates({ G, playerId, framework }) {
    if (framework.state.status.phase !== "main-phase") return [];
    const existingBases = framework.zones.getCards({ zone: "baseSection", playerId });
    if (existingBases.length >= 1) return [];
    const g = G;
    const handIds = framework.zones.getCards({ zone: "hand", playerId });
    const out: string[] = [];
    for (const cardId of handIds) {
      const def = framework.cards.getDefinition(cardId) as Card | undefined;
      if (!def || def.type !== "base") continue;
      const check = validatePlayFromHand(cardId, playerId, g, framework);
      if (check.valid) out.push(cardId);
    }
    return out;
  },

  validate({ G, playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") return { valid: true };
    const g = G;
    const { cardId, targets } = args;

    if (framework.state.status.phase !== "main-phase") {
      return {
        valid: false,
        error: "Can only deploy bases during the main phase",
        errorCode: "WRONG_PHASE",
      };
    }

    const definition = framework.cards.getDefinition(cardId) as Card | undefined;
    if (definition && definition.type !== "base") {
      return {
        valid: false,
        error: "Card is not a Base",
        errorCode: "NOT_A_BASE",
      };
    }

    const existingBases = framework.zones.getCards({ zone: "baseSection", playerId });
    if (existingBases.length >= 1) {
      return {
        valid: false,
        error: "Can only have one Base in play at a time (Rule 4-6-3)",
        errorCode: "BASE_LIMIT_REACHED",
      };
    }

    const commonResult = validatePlayFromHand(cardId, playerId, g, framework);
    if (!commonResult.valid) return commonResult;

    return validateDeployTriggerTargets(cardId, playerId, targets ?? [], g, framework);
  },

  execute({ G, playerId, args, moveId, framework }) {
    const g = G;
    const { cardId, targets } = args;

    const paidCost = payCardCost(cardId, playerId, g, framework);

    framework.zones.moveCard(cardId, { zone: "baseSection", playerId });
    g.turnMetadata.deployedThisTurn.push(cardId);
    framework.cards.patchMeta(cardId, { deployedThisTurn: true, exhausted: false });

    // Placement event — synchronous zone-change signal. The completion
    // event (BASE_DEPLOYED) fires from the completion fence below,
    // after every triggered effect produced by this move resolves.
    emitGundamEvent(framework.events, {
      kind: "BASE_PLACED",
      payload: { cardId, playerId },
    });
    emitGundamLog(framework, {
      type: "gundam.move.deployBase",
      values: { cardId, playerId, cost: paidCost },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    // Enqueue 【Deploy】 effects onto g.pendingEffects; the flow engine's
    // onTransitionCheck drains auto-resolvable heads and halts for any
    // that still need a player decision. Forward `chosenTargets` so
    // pre-validated targets auto-drain instead of halting the flow.
    const event = { type: "baseDeployed", cardId, playerId, fromZone: "hand" };
    enqueueOwnCardTriggers(g, event, cardId, playerId, framework, {
      chosenTargets: targets,
      originatingMoveId: moveId,
    });
    enqueueObserverTriggers(g, event, framework, cardId, { originatingMoveId: moveId });

    enqueueMoveCompletionFence(
      g,
      playerId,
      framework,
      [
        {
          kind: "emitEvent",
          event: { kind: "BASE_DEPLOYED", payload: { cardId, playerId } },
        },
      ],
      moveId,
    );
  },
};
