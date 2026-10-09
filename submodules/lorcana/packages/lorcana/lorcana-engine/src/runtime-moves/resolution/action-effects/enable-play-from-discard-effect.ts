import type { CardInstanceId } from "#core";
import type { EnablePlayFromDiscardEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import { addPlayFromDiscardPermission } from "../../effects/play-from-discard-permissions";
import { resolveTemporaryEffectExpiryTurn } from "../../effects/temporary-effects";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";

export function isEnablePlayFromDiscardEffect(
  effect: unknown,
): effect is EnablePlayFromDiscardEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "enable-play-from-discard"
  );
}

function resolvePermissionCardId(
  cardPlayed: CardPlayedPayload,
  effect: EnablePlayFromDiscardEffect,
  resolutionInput: ActionResolutionInput,
): CardInstanceId | null {
  if ((effect.source ?? "source") === "trigger-subject") {
    const subjectCardId = resolutionInput.eventSnapshot?.subjectCardId;
    return typeof subjectCardId === "string" && subjectCardId.length > 0
      ? (subjectCardId as CardInstanceId)
      : null;
  }

  return cardPlayed.cardId as CardInstanceId;
}

export function resolveEnablePlayFromDiscardEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: EnablePlayFromDiscardEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const cardId = resolvePermissionCardId(cardPlayed, effect, resolutionInput);
  if (!cardId) {
    return;
  }

  const currentTurn = ctx.framework.state.status.turn ?? 1;
  const expiresAtTurn = resolveTemporaryEffectExpiryTurn(
    currentTurn,
    effect.duration ?? "this-turn",
  );

  const allCards = effect.scope === "all-cards";
  // cardId stays the ability source's real instance id even for player-wide
  // permissions — `allCards` is the discriminator, so consumers can branch on
  // it instead of matching a "*" sentinel (which no cardId comparison ever
  // hits).
  addPlayFromDiscardPermission(ctx.G.playFromDiscardPermissions, cardPlayed.playerId, {
    cardId,
    expiresAtTurn,
    cardType: effect.cardType,
    controllerId: cardPlayed.playerId,
    entersExerted: effect.entersExerted === true ? true : undefined,
    allCards,
    uniqueByName: allCards && effect.uniqueByName === true ? true : undefined,
    playedNames: [],
  });
}
