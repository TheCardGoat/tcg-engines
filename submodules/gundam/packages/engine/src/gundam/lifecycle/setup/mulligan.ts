import { exbpExBase001, exrpExResource003 } from "@tcg/gundam-token-data";
import type { LifecycleContext } from "../../../types/index.ts";
import { canPlaceResource } from "../../moves/core/play-card-shared.ts";
import { emitGundamLog } from "../../logging.ts";

// Engine-spawned setup tokens. We import the canonical defs from
// `@tcg/gundam-cards` instead of duplicating them inline so a single
// source of truth feeds both the runtime registry and the static
// catalog (which the view filter needs to resolve images and stats).
//
// REVISIT once real matchmaking is in place: players will assemble
// their own decks and likely choose which tokens to bundle (alt-art
// EX Base/Resource printings, set-specific tokens, etc.). At that
// point the host should pass the chosen token defs in alongside the
// deck list rather than the engine hard-coding EXBP-001 / EXRP-003.
const EX_BASE_TOKEN_DEF = exbpExBase001;
const EX_RESOURCE_TOKEN_DEF = exrpExResource003;

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
    const tokenId = `ex-base-token:${pid as string}`;
    ctx.framework.cards.registerDefinition(tokenId, EX_BASE_TOKEN_DEF, pid);
    ctx.framework.zones.placeToken(tokenId, { zone: "baseSection", playerId: pid as string }, pid, {
      isToken: true,
    });
  }

  if (secondPlayer) {
    const secondPlayerStr = secondPlayer as string;
    if (canPlaceResource(secondPlayerStr, true, ctx.framework)) {
      const resourceTokenId = `ex-resource-token:${secondPlayerStr}`;
      ctx.framework.cards.registerDefinition(resourceTokenId, EX_RESOURCE_TOKEN_DEF, secondPlayer);
      ctx.framework.zones.placeToken(
        resourceTokenId,
        { zone: "resourceArea", playerId: secondPlayerStr },
        secondPlayer,
        { isToken: true },
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
