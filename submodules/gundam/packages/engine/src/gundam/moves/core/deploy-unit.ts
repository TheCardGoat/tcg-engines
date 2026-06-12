/**
 * Deploy Unit Move
 *
 * Plays a Unit card from hand into the battle area.
 * Rules 7-5-2-1: deploy a Unit by paying its cost.
 * Rules 3-2-1: Unit cards are deployed into the battle area.
 * Rules 3-2-4: A newly deployed Unit cannot attack on the turn it is deployed.
 * Rule 3-2-6-3: Link Units are exempt and can attack on the deploy turn.
 */

import type { Card, CardEffect, EffectCondition, EffectDirective } from "@tcg/gundam-types";
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
import { buildTargetResolutionContext } from "../../rules/derived-state.ts";
import { evaluateCondition, evaluateTargetFilter } from "../../../runtime/target-dsl.ts";

export const deployUnit: GundamMoveDefinition<"deployUnit"> = {
  gatedByPendingEffects: true,

  enumerateCandidates({ G, playerId, framework }) {
    if (framework.state.status.phase !== "main-phase") return [];
    const g = G;
    const handIds = framework.zones.getCards({ zone: "hand", playerId });
    const out: string[] = [];
    for (const cardId of handIds) {
      const def = framework.cards.getDefinition(cardId) as Card | undefined;
      if (!def || def.type !== "unit") continue;
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
        error: "Can only deploy units during the main phase",
        errorCode: "WRONG_PHASE",
      };
    }

    const definition = framework.cards.getDefinition(cardId) as Card | undefined;
    if (definition && definition.type !== "unit") {
      return {
        valid: false,
        error: "Card is not a Unit",
        errorCode: "NOT_A_UNIT",
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

    // Deploy to BattleArea
    framework.zones.moveCard(cardId, { zone: "battleArea", playerId });
    g.turnMetadata.deployedThisTurn.push(cardId);
    const entersRested = shouldDeployRested(cardId, playerId, g, framework);
    framework.cards.patchMeta(cardId, { deployedThisTurn: true, exhausted: entersRested });
    g.exhausted[cardId] = entersRested; // Rule: units enter play active unless a replacement applies.

    // Placement event — synchronous zone-change signal. Listeners that
    // need the post-trigger state should subscribe to UNIT_DEPLOYED
    // (fired by the completion fence below) instead.
    emitGundamEvent(framework.events, {
      kind: "UNIT_PLACED",
      payload: { cardId, playerId },
    });
    emitGundamLog(framework, {
      type: "gundam.move.deployUnit",
      values: { cardId, playerId, cost: paidCost },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    // Enqueue 【Deploy】 effects onto g.pendingEffects; the flow engine's
    // onTransitionCheck drains auto-resolvable heads and halts on any
    // head that still needs player input.
    const event = { type: "unitDeployed", cardId, playerId, fromZone: "hand" };
    enqueueOwnCardTriggers(g, event, cardId, playerId, framework, {
      chosenTargets: targets,
      originatingMoveId: moveId,
    });
    enqueueObserverTriggers(g, event, framework, cardId, { originatingMoveId: moveId });

    // Completion fence — fires UNIT_DEPLOYED only after every triggered
    // effect produced by this move has resolved. Tier-sorted strictly
    // last in the queue (see `tierOf`) so observer triggers from the
    // standby player + rule 10-1-6-7 preempts all settle first.
    enqueueMoveCompletionFence(
      g,
      playerId,
      framework,
      [
        {
          kind: "emitEvent",
          event: { kind: "UNIT_DEPLOYED", payload: { cardId, playerId } },
        },
      ],
      moveId,
    );
  },
};

function shouldDeployRested(
  cardId: string,
  playerId: string,
  g: Parameters<GundamMoveDefinition<"deployUnit">["execute"]>[0]["G"],
  framework: Parameters<GundamMoveDefinition<"deployUnit">["execute"]>[0]["framework"],
): boolean {
  const deployed = framework.cards.get(cardId);
  if (!deployed) return false;

  for (const sourcePlayerId of Object.keys(g.players)) {
    for (const sourceId of framework.zones.getCards({
      zone: "battleArea",
      playerId: sourcePlayerId,
    })) {
      const def = framework.cards.getDefinition(sourceId) as Card | undefined;
      if (!def?.effects?.length) continue;
      const ctx = buildTargetResolutionContext(g, sourcePlayerId, framework, {
        sourceCardId: sourceId,
      });
      for (const effect of def.effects as CardEffect[]) {
        if (effect.type !== "constant") continue;
        if (effect.activation.conditions?.length) {
          const met = effect.activation.conditions.every((cond) =>
            evaluateCondition(cond as EffectCondition, ctx),
          );
          if (!met) continue;
        }
        for (const directive of effect.directives) {
          if (!("action" in directive)) continue;
          const action = (directive as EffectDirective).action;
          if (action.action !== "deployRested") continue;
          const matches = evaluateTargetFilter(action.target, [deployed], ctx);
          if (matches.includes(cardId as never)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
