import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../types";
import type {
  ActionResolutionInput,
  PlayCardExecutionContext,
} from "../resolution/action-effects/types";
import { recordEvent, snapshotTriggeredCandidatesForCard } from "../../triggered-abilities";

/**
 * Emit "be-chosen" triggered events for each pre-determined target of an
 * action card or activated ability.
 *
 * This must be called *before* the effect resolver begins so that the
 * triggered-ability system can collect candidates while the targets are
 * still in play. The events are flushed to the bag at the normal
 * resolution boundary together with any other triggered events.
 */
export function emitBeChosenEvents(
  ctx: PlayCardExecutionContext,
  cardPlayed: Pick<CardPlayedPayload, "playerId" | "cardId" | "cardType">,
  resolutionInput: ActionResolutionInput,
): void {
  const targets = resolutionInput.targets;
  if (!targets || !Array.isArray(targets)) {
    return;
  }

  const sourceCardType = cardPlayed.cardType;
  // Emit for actions, items, and characters (covers "chosen for an action or ability")
  // Locations are excluded since they don't target characters.
  if (sourceCardType !== "action" && sourceCardType !== "item" && sourceCardType !== "character") {
    return;
  }

  const seen = new Set<string>();
  for (const target of targets) {
    const targetId = typeof target === "string" ? target : undefined;
    if (!targetId || seen.has(targetId)) {
      continue;
    }
    seen.add(targetId);

    const ownerId = ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined;
    if (!ownerId) {
      continue;
    }

    const triggerCandidates = snapshotTriggeredCandidatesForCard(ctx, targetId as CardInstanceId);

    recordEvent(ctx, {
      event: "be-chosen",
      playerId: ownerId,
      subjectCardId: targetId as CardInstanceId,
      triggerSourceCardId: cardPlayed.cardId,
      sourceCardType,
      triggerCandidates,
    });
  }
}
