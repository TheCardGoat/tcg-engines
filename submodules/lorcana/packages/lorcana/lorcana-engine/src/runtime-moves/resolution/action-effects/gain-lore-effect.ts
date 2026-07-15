import type { CardInstanceId } from "#core";
import type { GainLoreEffect } from "@tcg/lorcana-types";
import type { PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types/index";
import type { PlayCardExecutionContext } from "./types";
import { resolveCurrentTurnPlayerId } from "../../../targeting/runtime";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import { hasOpponentStaticPlayRestriction } from "../../rules/static-ability-utils";
import { hasTemporaryPlayerRestriction } from "../../effects/temporary-effects";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";

type ResolvedGainLoreEffectInput = {
  gainAmount?: number;
  selectedPlayerIds?: PlayerId[];
  selectedTargets?: CardInstanceId[];
};

export function isGainLoreEffect(effect: unknown): effect is GainLoreEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "gain-lore"
  );
}

function resolveGainLoreTargetPlayerIds(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  target: GainLoreEffect["target"],
  selectedPlayerIds?: PlayerId[],
  selectedTargets?: CardInstanceId[],
): PlayerId[] {
  const normalizedTarget = target ?? "CONTROLLER";
  const opponents = ctx.framework.state.playerIds.filter(
    (playerId) => playerId !== cardPlayed.playerId,
  );

  switch (normalizedTarget) {
    case "SELF":
    case "CONTROLLER":
      return [cardPlayed.playerId];
    case "EACH_PLAYER":
    case "ALL_PLAYERS":
      return [...ctx.framework.state.playerIds];
    case "OPPONENT":
      return opponents.length > 0 ? [opponents[0]!] : [];
    case "OPPONENTS":
    case "EACH_OPPONENT":
      return opponents;
    case "CURRENT_TURN": {
      const currentTurnPlayerId = resolveCurrentTurnPlayerId(ctx);
      return currentTurnPlayerId ? [currentTurnPlayerId] : [];
    }
    case "CARD_OWNER":
      return [
        ...new Set(
          (selectedTargets ?? [])
            .map((cardId) => ctx.framework.zones.getCardOwner(cardId))
            .filter((playerId): playerId is PlayerId => typeof playerId === "string"),
        ),
      ];
    case "CHOSEN_PLAYER":
      return selectedPlayerIds ?? [];
    default:
      return [];
  }
}

function isPlayerBlockedFromGainingLore(
  ctx: PlayCardExecutionContext,
  playerId: PlayerId,
): boolean {
  const currentTurn = ctx.framework.state.status.turn ?? 1;
  if (
    hasTemporaryPlayerRestriction(
      ctx.G.temporaryPlayerRestrictions,
      playerId,
      currentTurn,
      "cant-gain-lore",
    )
  ) {
    return true;
  }

  const registry = getOrBuildMoveRegistry(ctx);

  return hasOpponentStaticPlayRestriction({
    state: ctx.framework.state,
    playerId,
    restriction: "cant-gain-lore",
    registry,
  });
}

export function resolveGainLoreEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: GainLoreEffect,
  resolvedInput: ResolvedGainLoreEffectInput,
): void {
  const gainAmount =
    typeof resolvedInput.gainAmount === "number" &&
    Number.isFinite(resolvedInput.gainAmount) &&
    resolvedInput.gainAmount > 0
      ? resolvedInput.gainAmount
      : undefined;
  if (!gainAmount) {
    return;
  }

  const targetPlayerIds = resolveGainLoreTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target,
    resolvedInput.selectedPlayerIds,
    resolvedInput.selectedTargets,
  );
  for (const playerId of targetPlayerIds) {
    if (isPlayerBlockedFromGainingLore(ctx, playerId)) {
      continue;
    }
    const currentLore = Number(ctx.G.lore[playerId] ?? 0);
    ctx.G.lore[playerId] = currentLore + gainAmount;
    emitTriggeredLorcanaEvent(
      ctx,
      "loreChanged",
      {
        playerId,
        operation: "add",
        previousLore: currentLore,
        source: "effect",
        amount: gainAmount,
        newLore: currentLore + gainAmount,
      },
      {
        event: "gain-lore",
        playerId,
        triggerSourceCardId: cardPlayed.cardId,
        eventSnapshot: {
          triggerAmount: gainAmount,
        },
      },
    );
  }
}
