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
import type { CardDragSource, CardDropEvent } from "./dropEvent";
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

function isFriendlyAttachHostZone(zone: string): boolean {
  return zone === "p-field" || zone === "p-legendArea";
}

/**
 * Structural check, ignoring the live interaction view: could this drag source
 * ever resolve against a card target in this zone? Collision ranking uses it
 * so a card that cannot accept the drag falls through to its enclosing zone
 * (a Gear released "onto the field" then opens the attachment chooser)
 * instead of silently swallowing the drop while the zone cue is showing.
 */
export function dropShapeAcceptsCardTarget(
  source: Pick<CardDragSource, "zone" | "cardType">,
  targetZone: string,
): boolean {
  if (source.zone !== "p-hand") {
    return true;
  }
  if (source.cardType === "program") {
    return isProgramCardTargetZone(targetZone);
  }
  if (source.cardType === "gear") {
    return isFriendlyAttachHostZone(targetZone);
  }
  return targetZone === "p-field";
}

function isProgramCardTargetZone(zone: string): boolean {
  return (
    zone === "p-field" ||
    zone === "opp-field" ||
    zone === "p-legendArea" ||
    zone === "opp-legendArea"
  );
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

    // The drop records a preferred effect target in the UI. Playing the
    // Program remains a separate move; the effect target is legal only after
    // the engine exposes its later choice.
    if (source.zone === "p-hand" && isProgramCardTargetZone(target.zone)) {
      const sourceCard = ctx.humanZones.hand.find((c) => c.cardId === source.cardId);
      if (sourceCard?.cardType === "program") {
        return hasLegalMove(ctx, source.cardId, "playCard")
          ? { type: "playCard", cardId: source.cardId, as }
          : null;
      }
    }

    // Hand → friendly host card: gear attach. `cardType === "gear"` is the
    // routing signal (gear lands on a card, other types on the zone); the
    // legality gate is still the engine's `playCard` permission.
    if (source.zone === "p-hand" && isFriendlyAttachHostZone(target.zone)) {
      const sourceCard = ctx.humanZones.hand.find((c) => c.cardId === source.cardId);
      if (sourceCard?.cardType !== "gear") {
        if (target.zone !== "p-field") {
          return null;
        }
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
    // Legend area → field: GO SOLO. The interaction candidate is the single
    // legality source: it accounts for the Legend's keyword, the current
    // phase/turn, and every available resource needed for its effective cost.
    if (source.zone === "p-legendArea" && target.zone === "p-field") {
      if (!hasLegalMove(ctx, source.cardId, "goSolo")) {
        return null;
      }
      return { type: "goSolo", cardId: source.cardId, as };
    }
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
    // Field → either opponent scoring surface: direct attack.
    if (
      source.zone === "p-field" &&
      (target.zone === "opp-pinfo" || target.zone === "opp-gigArea")
    ) {
      if (!interactionViewCanAttackRival(ctx.interactionView, source.cardId)) {
        return null;
      }
      return { type: "attackRival", attackerId: source.cardId, as };
    }
    return null;
  }

  return null;
}
