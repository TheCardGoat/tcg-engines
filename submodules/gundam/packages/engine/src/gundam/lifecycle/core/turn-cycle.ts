import type { LifecycleContext } from "../../../types/index.ts";
import type { PlayerId } from "../../../types/branded.ts";
import type { GundamG } from "../../types.ts";
import { hasKeyword, getKeywordValue } from "../../rules/derived-state.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog } from "../../logging.ts";

export function turnCycleOnBegin(ctx: LifecycleContext): void {
  const currentTurnPlayer = ctx.framework.state.status.turnPlayer as string | undefined;
  const nextTurnPlayer = ctx.framework.state.status.nextTurnPlayer;

  let newTurnPlayer: string;
  if (nextTurnPlayer) {
    newTurnPlayer = nextTurnPlayer as unknown as string;
  } else {
    newTurnPlayer = currentTurnPlayer ?? (ctx.framework.state.playerIds[0] as unknown as string);
  }

  ctx.framework.status.patch({
    turnPlayer: newTurnPlayer as PlayerId,
    activePlayer: newTurnPlayer as PlayerId,
    nextTurnPlayer: undefined,
  });

  emitGundamEvent(ctx.framework.events, {
    kind: "TURN_STARTED",
    payload: { playerId: newTurnPlayer },
  });
  emitGundamLog(ctx.framework, {
    type: "gundam.turn.started",
    values: { playerId: newTurnPlayer, turnNumber: ctx.framework.state.status.turn ?? 0 },
    visibility: { mode: "PUBLIC" },
    category: "system",
  });
}

export function turnCycleOnEnd(ctx: LifecycleContext): void {
  const g = ctx.G as GundamG;
  const currentPlayer = ctx.framework.state.status.turnPlayer as string | undefined;

  emitGundamEvent(ctx.framework.events, {
    kind: "TURN_ENDED",
    payload: { playerId: currentPlayer },
  });
  if (currentPlayer) {
    emitGundamLog(ctx.framework, {
      type: "gundam.turn.ended",
      values: { playerId: currentPlayer },
      visibility: { mode: "PUBLIC" },
      category: "system",
    });
  }

  if (currentPlayer) {
    const zones = ["battleArea", "baseSection"] as const;
    for (const zone of zones) {
      const cards = ctx.framework.zones.getCards({ zone, playerId: currentPlayer });
      for (const cardId of cards) {
        if (hasKeyword(cardId, "Repair", g, ctx.framework.cards)) {
          const value = getKeywordValue(cardId, "Repair", g, ctx.framework.cards);
          const current = g.damage[cardId] ?? 0;
          if (current > 0) {
            const remaining = current - value;
            if (remaining > 0) {
              g.damage[cardId] = remaining;
            } else {
              delete g.damage[cardId];
            }
          }
        }
      }
    }
  }

  g.turnMetadata = {
    attackedThisTurn: [],
    deployedThisTurn: [],
    pendingCombat: undefined,
  };

  g.continuousEffects = g.continuousEffects.filter(
    (e) => e.duration !== "this-turn" && e.duration !== "this-battle",
  );
  g.resolvedThisTurn = [];

  const playerIds = [...ctx.framework.state.playerIds] as string[];
  const activeIndex = currentPlayer ? playerIds.indexOf(currentPlayer) : 0;
  const nextIndex = (activeIndex + 1) % playerIds.length;
  const nextPlayer = playerIds[nextIndex];
  if (nextPlayer) {
    ctx.framework.status.patch({
      nextTurnPlayer: nextPlayer as PlayerId,
    });
  }
}
