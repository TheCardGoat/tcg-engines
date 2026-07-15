import type { CardInstanceId, PlayerId } from "#core";
import type { PlayerTarget, LorcanaPlayerTarget } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { DynamicAmountEventSnapshot } from "../../../types/domain-events";
import type { CardRuntimeReadAPI, DeepReadonly, FrameworkReadAPI } from "../../../core/runtime";
import type { LorcanaG } from "../../../types";
import type { TargetSelectionInput } from "../../../targeting/runtime";
import {
  resolveSelectedPlayerIds,
  resolveTargetPlayerIds as resolveUnifiedPlayerTargets,
} from "../../../targeting/runtime";

type PlayerTargetResolutionContext = {
  G: DeepReadonly<LorcanaG>;
  playerId?: PlayerId;
  framework: FrameworkReadAPI;
  cards: CardRuntimeReadAPI;
};

function normalizeSelectedTargets(selectedTargets?: TargetSelectionInput): string[] {
  if (typeof selectedTargets === "string") {
    return selectedTargets ? [selectedTargets] : [];
  }

  return Array.isArray(selectedTargets)
    ? selectedTargets.filter((target): target is string => typeof target === "string")
    : [];
}

export function resolveTargetPlayerIds(
  ctx: PlayerTargetResolutionContext,
  cardPlayed: CardPlayedPayload,
  target: PlayerTarget | LorcanaPlayerTarget | "SELF" | unknown,
  selectedTargets?: TargetSelectionInput,
  eventSnapshot?: DynamicAmountEventSnapshot,
): PlayerId[] {
  if (target === "CARD_OWNER") {
    return [
      ...new Set(
        normalizeSelectedTargets(selectedTargets)
          .map((cardId) => ctx.framework.zones.getCardOwner(cardId as CardInstanceId))
          .filter((playerId): playerId is PlayerId => typeof playerId === "string"),
      ),
    ];
  }

  // Handle TRIGGER_SOURCE_OWNER: resolve to the owner of the card that triggered the ability
  if (target === "TRIGGER_SOURCE_OWNER") {
    const triggerSourceCardId = eventSnapshot?.triggerSourceCardId;
    if (triggerSourceCardId) {
      const owner = ctx.framework.zones.getCardOwner(triggerSourceCardId) as PlayerId | undefined;
      if (owner) {
        return [owner];
      }
    }
    return [];
  }

  // Handle CHALLENGING_PLAYER: resolve to the owner of the attacking character
  if (target === "CHALLENGING_PLAYER") {
    const attackerId = eventSnapshot?.attackerId;
    if (attackerId) {
      const attackerOwner = ctx.framework.zones.getCardOwner(attackerId) as PlayerId | undefined;
      if (attackerOwner) {
        return [attackerOwner];
      }
    }
    // Fallback: if no attacker context, return empty (effect can't resolve)
    return [];
  }

  return resolveUnifiedPlayerTargets(
    ctx as Parameters<typeof resolveUnifiedPlayerTargets>[0],
    target ?? "CONTROLLER",
    {
      controllerId: cardPlayed.playerId,
      sourceCardId: cardPlayed.cardId,
      selectedPlayerIds: resolveSelectedPlayerIds(ctx.framework.state.playerIds, selectedTargets),
    },
  );
}
