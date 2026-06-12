import type { LifecycleContext } from "../../../types/index.ts";
import type { PlayerId } from "../../../types/branded.ts";
import { emitGundamEvent } from "../../events.ts";
import { emitGundamLog, logPhaseEntered } from "../../logging.ts";

export function drawPhaseOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "draw-phase" });

  const turnPlayer = ctx.framework.state.status.turnPlayer as string | undefined;
  if (!turnPlayer) return;

  const deckCards = ctx.framework.zones.getCards({ zone: "deck", playerId: turnPlayer });
  if (deckCards.length === 0) {
    const opponentId = ctx.framework.state.playerIds.find((id) => id !== turnPlayer);
    ctx.framework.events.endGame({
      winner: opponentId,
      reason: "Player ran out of cards",
    });
    return;
  }

  const drawnIds = ctx.framework.zones.drawCards({
    from: { zone: "deck", playerId: turnPlayer },
    to: { zone: "hand", playerId: turnPlayer },
    count: 1,
  });

  if (drawnIds.length > 0) {
    emitGundamLog(ctx.framework, {
      type: "gundam.effect.cardsDrawn",
      values: { playerId: turnPlayer, count: drawnIds.length },
      visibility: { mode: "PUBLIC" },
      category: "system",
    });
    emitGundamLog(ctx.framework, {
      type: "gundam.effect.cardsDrawn",
      values: { playerId: turnPlayer, count: drawnIds.length, cardIds: drawnIds },
      visibility: { mode: "PRIVATE", visibleTo: [turnPlayer as PlayerId] },
      category: "system",
    });
  }

  emitGundamEvent(ctx.framework.events, {
    kind: "DRAW_PHASE",
    payload: { playerId: turnPlayer },
  });
}
