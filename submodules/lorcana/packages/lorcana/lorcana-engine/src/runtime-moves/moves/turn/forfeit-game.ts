import type { PlayerId, RuntimeValidationResult } from "#core";
import { createLorcanaLogProjection, type LorcanaMoveDefinition } from "../../../types";

/**
 * Server-only move that ends the game in favour of a specific player.
 *
 * Used by the server for timeout/disconnect forfeits. Cannot be called by
 * players (serverOnly: true). ignorePriority: true so it can fire at any
 * point in the turn, regardless of who holds priority.
 */
export const forfeitGame: LorcanaMoveDefinition<"forfeitGame"> = {
  serverOnly: true,
  ignorePriority: true,

  validate: (ctx): RuntimeValidationResult => {
    const { winnerId } = ctx.args;
    const players = Object.keys(ctx.G.lore) as PlayerId[];
    if (!players.includes(winnerId as PlayerId)) {
      return { valid: false, error: "Invalid winner", errorCode: "INVALID_PLAYER" };
    }
    return { valid: true };
  },

  execute: (ctx) => {
    const { winnerId, reason } = ctx.args;

    ctx.framework.log(
      createLorcanaLogProjection(
        "lorcana.move.forfeitGame",
        { winnerId: winnerId as PlayerId, reason },
        { mode: "PUBLIC" },
        "action",
      ),
    );

    ctx.framework.events.endGame({
      winner: winnerId,
      reason,
    });
  },
};
