import type { CardInstanceId } from "#core";
import type { GainInkDropEffect } from "@tcg/lorcana-types";
import type { PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types/index";
import type { PlayCardExecutionContext } from "./types";
import { resolveTargetPlayerIds } from "../../../targeting/runtime/target-resolver";
import { resolveCurrentTurnPlayerId } from "../../../targeting/runtime";
import { gainInkDrops } from "../../rules/ink-drops";

type ResolvedGainInkDropEffectInput = {
  gainAmount?: number;
  selectedPlayerIds?: PlayerId[];
  selectedTargets?: CardInstanceId[];
};

export function isGainInkDropEffect(effect: unknown): effect is GainInkDropEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "gain-ink-drop"
  );
}

export function resolveGainInkDropTargetPlayerIds(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  target: GainInkDropEffect["target"],
  selectedPlayerIds?: PlayerId[],
): PlayerId[] {
  if (target && typeof target === "object") {
    return resolveTargetPlayerIds(ctx, target, {
      controllerId: cardPlayed.playerId,
      sourceCardId: cardPlayed.cardId,
      selectedPlayerIds,
    });
  }
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
    case "CHOSEN_PLAYER":
      return selectedPlayerIds ?? [];
    default:
      return [];
  }
}

export function resolveGainInkDropEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: GainInkDropEffect,
  resolvedInput: ResolvedGainInkDropEffectInput,
): void {
  const gainAmount =
    typeof resolvedInput.gainAmount === "number" &&
    Number.isFinite(resolvedInput.gainAmount) &&
    resolvedInput.gainAmount > 0
      ? Math.floor(resolvedInput.gainAmount)
      : 0;
  if (gainAmount === 0) {
    return;
  }

  const targetPlayerIds = resolveGainInkDropTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target,
    resolvedInput.selectedPlayerIds,
  );
  for (const playerId of targetPlayerIds) {
    gainInkDrops(ctx, playerId, gainAmount, "effect", cardPlayed.cardId);
  }
}

/**
 * Baymax - Amped Up "Supercharge": true when the player controls a static
 * would-gain-ink-drop-replacement ability. The composed resolver offers the
 * controller a choice before the incoming drop is gained.
 */
export function redirectGainToInkwellReplacement(
  ctx: PlayCardExecutionContext,
  playerId: PlayerId,
): boolean {
  const playCards = ctx.framework.zones.getCards({ zone: "play", playerId }) as CardInstanceId[];
  return playCards.some((sourceId) => {
    const def = ctx.cards.getDefinition(sourceId) as
      | { abilities?: { type?: string; effect?: { restriction?: string } }[] }
      | undefined;
    return (def?.abilities ?? []).some(
      (ability) =>
        ability?.type === "static" &&
        ability.effect?.restriction === "would-gain-ink-drop-replacement",
    );
  });
}
