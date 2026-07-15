// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-topic/turn-actions.md

import type {
  CardInstanceId,
  PlayerId,
  RuntimeCardWithDefinition,
  RuntimeValidationResult,
} from "#core";
import type { LorcanaCardDerived } from "../../../types/projected-board";

type LorcanaRuntimeCard = RuntimeCardWithDefinition & LorcanaCardDerived;
import { type LorcanaMoveDefinition } from "../../../types";
import { createLorcanaLogProjection } from "../../../types";
import { INKWELL_CANDIDATE_QUERY_DSL, canInkThisTurn } from "../../state/runtime-card-derived";
import { hasAnyPendingEffects, validateNoPendingEffects } from "../../../operations";
import {
  emitTriggeredLorcanaEvent,
  flushTriggeredEventsToBag,
} from "../../effects/triggered-abilities";
import { recordCardPutIntoInkwellThisTurn } from "../../state/turn-metrics";

function buildTurnActionInkState(ctx: {
  G: {
    turnMetadata: { inkedThisTurn: readonly CardInstanceId[]; additionalInkwellActions?: number };
  };
  framework: {
    state: {
      priority?: { holder?: string };
      _zonesPrivate: {
        cardIndex: Record<string, { controllerID?: string; zoneKey?: string } | undefined>;
      };
    };
  };
}) {
  return {
    G: ctx.G,
    ctx: {
      priority: ctx.framework.state.priority,
      zones: { private: ctx.framework.state._zonesPrivate },
    },
  };
}

/**
 * Put a card into the inkwell
 */
export const putCardIntoInkwell: LorcanaMoveDefinition<"putCardIntoInkwell"> = {
  validate: (ctx): RuntimeValidationResult => {
    const pendingFailure = validateNoPendingEffects(ctx, { actionLabel: "ink cards" });
    if (pendingFailure) {
      return pendingFailure;
    }

    const { cardId } = ctx.args;
    const currentPlayer = (ctx.framework.state.priority.holder ?? ctx.playerId) as PlayerId;

    // Enforce once-per-turn inkwell rule (Rule 4.3.3)
    if (
      !canInkThisTurn({
        state: buildTurnActionInkState(ctx),
        getDefinitionByInstanceId: (cardId) => ctx.cards.getDefinition(cardId),
      })
    ) {
      return { valid: false, error: "Already inked this turn", errorCode: "ALREADY_INKED" };
    }

    if (ctx.validationMode === "preflight" && cardId == null) {
      return { valid: true };
    }

    // Check card is in hand (or discard, when a static grants discard inkability)
    const handCards = ctx.framework.zones.getCards({ zone: "hand", playerId: currentPlayer });
    const discardCards = ctx.framework.zones.getCards({ zone: "discard", playerId: currentPlayer });
    if (!handCards.includes(cardId) && !discardCards.includes(cardId)) {
      return { valid: false, error: "Card not in hand", errorCode: "CARD_NOT_IN_HAND" };
    }

    const runtimeCard = ctx.cards.require(cardId);
    if (!runtimeCard) {
      return {
        valid: false,
        error: "Card definition not found",
        errorCode: "CARD_DEFINITION_NOT_FOUND",
      };
    }

    if (!(runtimeCard as LorcanaRuntimeCard).canBePutInInkwell) {
      return { valid: false, error: "Card is not inkable", errorCode: "NOT_INKABLE" };
    }

    return { valid: true };
  },

  execute: (ctx) => {
    const { args, G } = ctx;
    const { cardId } = args;
    const ownerId = ctx.framework.state.priority.holder as PlayerId;
    const revealUntilStateID = (ctx.framework.state.stateID ?? 0) + 3;

    // Determine source zone before moving
    const discardCards = ctx.framework.zones.getCards({ zone: "discard", playerId: ownerId });
    const sourceZone = discardCards.includes(cardId) ? "discard" : "hand";

    const inkwellZoneRef = { zone: "inkwell", playerId: ownerId };
    ctx.framework.zones.moveCard(cardId, inkwellZoneRef);
    ctx.cards.patchMeta(cardId, { state: "ready", publicFaceState: "faceDown" });
    ctx.framework.zones.reveal([cardId], "all", {
      stateID: revealUntilStateID,
      affectsUndo: false,
    });
    ctx.framework.log(
      createLorcanaLogProjection(
        "lorcana.card.inked",
        {
          playerId: ownerId,
          cardId: cardId as CardInstanceId,
        },
        { mode: "PUBLIC" },
        "action",
      ),
    );

    G.turnMetadata.inkedThisTurn.push(cardId as CardInstanceId);
    recordCardPutIntoInkwellThisTurn(ctx, cardId as CardInstanceId);

    emitTriggeredLorcanaEvent(
      ctx,
      "cardInked",
      {
        playerId: ownerId,
        cardId,
        from: `${sourceZone}:${ownerId}`,
        to: `inkwell:${ownerId}`,
      },
      {
        event: "ink",
        playerId: ownerId,
        subjectCardId: cardId,
      },
    );
    flushTriggeredEventsToBag(ctx);
  },

  available: (ctx) => {
    if (hasAnyPendingEffects(ctx)) {
      return false;
    }

    // Enforce once-per-turn inkwell rule (Rule 4.3.3)
    if (
      !canInkThisTurn({
        state: buildTurnActionInkState(ctx),
        getDefinitionByInstanceId: (cardId) => ctx.cards.getDefinition(cardId),
      })
    ) {
      return false;
    }

    const queryByTarget = ctx.cards.queryTargetDsl ?? ctx.cards.queryRuntime;
    const validCardsRuntime = queryByTarget(INKWELL_CANDIDATE_QUERY_DSL).filter(
      (card) => (card as LorcanaRuntimeCard).canBePutInInkwell,
    );

    return validCardsRuntime.length > 0;
  },
};
