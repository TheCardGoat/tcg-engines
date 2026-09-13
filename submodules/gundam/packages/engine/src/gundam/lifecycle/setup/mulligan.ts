import type { Card } from "@tcg/gundam-types";
import type { LifecycleContext } from "../../../types/index.ts";
import { canPlaceResource } from "../../moves/core/play-card-shared.ts";
import { emitGundamLog } from "../../logging.ts";

export const GUNDAM_SETUP_SLOT_EX_BASE = "ex-base";
export const GUNDAM_SETUP_SLOT_EX_RESOURCE = "ex-resource";

function requireSetupCard(ctx: LifecycleContext, playerId: string, slot: string): Card {
  const card = ctx.setupCards?.[playerId]?.[slot];
  if (!card) {
    throw new Error(`Host must supply a setup card for player ${playerId} slot ${slot}`);
  }
  return card;
}

export function mulliganOnEnter(ctx: LifecycleContext): void {
  for (const playerId of ctx.framework.state.playerIds) {
    ctx.framework.zones.shuffle({ zone: "deck", playerId: playerId as string });
    ctx.framework.zones.drawCards({
      from: { zone: "deck", playerId: playerId as string },
      to: { zone: "hand", playerId: playerId as string },
      count: 5,
    });
  }
}

export function mulliganOnExit(ctx: LifecycleContext): void {
  const allPlayerIds = ctx.framework.state.playerIds;
  const firstPlayer = ctx.framework.state.status.turnPlayer;
  const secondPlayer = allPlayerIds.find((id) => id !== firstPlayer);

  for (const pid of allPlayerIds) {
    ctx.framework.zones.drawCards({
      from: { zone: "deck", playerId: pid as string },
      to: { zone: "shieldArea", playerId: pid as string },
      count: 6,
    });
  }

  for (const pid of allPlayerIds) {
    const tokenDef = requireSetupCard(ctx, pid as string, GUNDAM_SETUP_SLOT_EX_BASE);
    const tokenId = `ex-base-token:${pid as string}`;
    ctx.framework.cards.registerDefinition(tokenId, tokenDef, pid);
    ctx.framework.zones.placeToken(tokenId, { zone: "baseSection", playerId: pid as string }, pid, {
      isToken: true,
      tokenDefinitionId: tokenDef.cardNumber,
    });
  }

  if (secondPlayer) {
    const secondPlayerStr = secondPlayer as string;
    if (canPlaceResource(secondPlayerStr, true, ctx.framework)) {
      const tokenDef = requireSetupCard(ctx, secondPlayerStr, GUNDAM_SETUP_SLOT_EX_RESOURCE);
      const resourceTokenId = `ex-resource-token:${secondPlayerStr}`;
      ctx.framework.cards.registerDefinition(resourceTokenId, tokenDef, secondPlayer);
      ctx.framework.zones.placeToken(
        resourceTokenId,
        { zone: "resourceArea", playerId: secondPlayerStr },
        secondPlayer,
        { isToken: true, tokenDefinitionId: tokenDef.cardNumber },
      );
    }
  }

  emitGundamLog(ctx.framework, {
    type: "gundam.setup.done",
    values: {},
    visibility: { mode: "PUBLIC" },
    category: "system",
  });
}
