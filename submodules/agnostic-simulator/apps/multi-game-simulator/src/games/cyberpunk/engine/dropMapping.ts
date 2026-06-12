/**
 * Pure mapping: a UI drop event + the human seat's projection → an EngineAction
 * the page can dispatch. Returns `null` for drops that don't map to a legal
 * move so the caller can simply ignore them.
 *
 * Move-name knowledge lives here, not in the page. This is the only
 * non-context place inside the adapter that encodes "what does dragging X
 * onto Y mean" — keep it the single source of truth so click-paths and drag
 * paths can both consult it.
 *
 * `p-*` zone names mean "the side rendered at the bottom" (i.e. the human
 * seat). They do not encode P1 ownership. Drops always dispatch on behalf of
 * `humanSide`; the engine's permission system rejects illegal-by-turn drops.
 */

import type { EngineInteractionView } from "@tcg/protocol";
import type { CardDropEvent } from "./dropEvent";
import type { EngineAction } from "./EngineProvider";
import { PLAYER_SIDE_TO_ID, type Side } from "./sides";
import {
  interactionViewActionHasCandidate,
  interactionViewAttachTargets,
  interactionViewCanAttackRival,
  interactionViewCanFightTarget,
} from "./interactionViewHelpers";
import type { EngineCardType, ZoneCardView } from "./zoneViews";

export interface DropContext {
  /** The human-controlled seat. Drops dispatch with this side's player id. */
  humanSide: Side;
  /** View-model for the human hand. Used to branch on cardType (e.g. gear). */
  humanZones: { hand: Pick<ZoneCardView, "cardId" | "cardType">[] };
  /** Shared protocol interaction projection for the human side. */
  interactionView: EngineInteractionView;
}

function hasLegalMove(ctx: DropContext, cardId: string, moveId: string): boolean {
  return interactionViewActionHasCandidate(
    ctx.interactionView,
    moveId,
    inputIdForMove(moveId),
    cardId,
  );
}

export function getGearAttachTargets(
  ctx: Pick<DropContext, "interactionView">,
  cardId: string,
  cardType?: EngineCardType | null,
): string[] {
  if (cardType !== undefined && cardType !== "gear") {
    return [];
  }
  return interactionViewAttachTargets(ctx.interactionView, cardId);
}

function inputIdForMove(moveId: string): string {
  if (moveId === "attackRival") return "attackerId";
  if (moveId === "useBlocker") return "blockerId";
  return "cardId";
}

export function mapDropToAction(event: CardDropEvent, ctx: DropContext): EngineAction | null {
  const { source, target } = event;
  if (!source.cardId) {
    return null;
  }
  const as = PLAYER_SIDE_TO_ID[ctx.humanSide];

  // Drop onto another card.
  if (target.type === "card") {
    if (!target.cardId) {
      return null;
    }

    // Hand → friendly field card: gear attach. `cardType === "gear"` is the
    // routing signal (gear lands on a card, other types on the zone); the
    // legality gate is still the engine's `playCard` permission.
    if (source.zone === "p-hand" && target.zone === "p-field") {
      const sourceCard = ctx.humanZones.hand.find((c) => c.cardId === source.cardId);
      if (sourceCard?.cardType !== "gear") {
        if (!hasLegalMove(ctx, source.cardId, "playCard")) {
          return null;
        }
        return { type: "playCard", cardId: source.cardId, as };
      }
      if (!hasLegalMove(ctx, source.cardId, "playCard")) {
        return null;
      }
      if (!getGearAttachTargets(ctx, source.cardId, sourceCard.cardType).includes(target.cardId)) {
        return null;
      }
      return { type: "playCard", cardId: source.cardId, attachToId: target.cardId, as };
    }

    // Field → field: combat (attacker = source, defender = target).
    if (source.zone === "p-field" && target.zone === "opp-field") {
      if (!interactionViewCanFightTarget(ctx.interactionView, source.cardId, target.cardId)) {
        return null;
      }
      return {
        type: "attackUnit",
        attackerId: source.cardId,
        defenderId: target.cardId,
        as,
      };
    }

    return null;
  }

  // Drop onto a zone.
  if (target.type === "zone") {
    // Hand → field: play card.
    if (source.zone === "p-hand" && target.zone === "p-field") {
      if (!hasLegalMove(ctx, source.cardId, "playCard")) {
        return null;
      }
      return { type: "playCard", cardId: source.cardId, as };
    }
    // Hand → eddies: sell.
    if (source.zone === "p-hand" && target.zone === "p-eddies") {
      if (!hasLegalMove(ctx, source.cardId, "sellCard")) {
        return null;
      }
      return { type: "sellCard", cardId: source.cardId, as };
    }
    // Field → opponent rival info: direct attack.
    if (source.zone === "p-field" && target.zone === "opp-pinfo") {
      if (!interactionViewCanAttackRival(ctx.interactionView, source.cardId)) {
        return null;
      }
      return { type: "attackRival", attackerId: source.cardId, as };
    }
    return null;
  }

  return null;
}
