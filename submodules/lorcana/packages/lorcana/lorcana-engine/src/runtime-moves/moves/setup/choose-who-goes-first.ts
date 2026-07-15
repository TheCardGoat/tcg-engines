/**
 * Setup Moves for Lorcana Runtime
 *
 * Game initialization moves for the MatchRuntime architecture.
 */

import type { PlayerId, RuntimeValidationResult } from "#core";
import { createLorcanaLogProjection, type LorcanaMoveDefinition } from "../../../types";
import { resolveRuntimePlayerIds } from "./resolve-player-ids";

/**
 * Choose who goes first move
 */
export const chooseWhoGoesFirst: LorcanaMoveDefinition<"chooseWhoGoesFirst"> = {
  validate: ({ args, framework, validationMode }): RuntimeValidationResult => {
    const { playerId } = args;
    if (validationMode === "preflight" && playerId == null) {
      return { valid: true };
    }
    const resolvedPlayerIds = resolveRuntimePlayerIds({
      playerIds: framework.state.playerIds,
      _zonesPrivate: framework.state._zonesPrivate,
    });

    // Validate player exists
    if (!resolvedPlayerIds.includes(playerId as PlayerId)) {
      return { valid: false, error: `Invalid player ID: ${playerId}`, errorCode: "INVALID_PLAYER" };
    }

    return { valid: true };
  },

  execute: ({ playerId: chooser, args, framework }) => {
    const { playerId } = args;
    const chosenPlayer = playerId as PlayerId;
    const resolvedPlayerIds = resolveRuntimePlayerIds({
      playerIds: framework.state.playerIds,
      _zonesPrivate: framework.state._zonesPrivate,
    });
    // Historical save-games may omit `playerIds` from move context; fallback to the chosen
    // player so mulligan flow still has a valid starting player list.
    const pendingMulligan =
      resolvedPlayerIds.length > 0
        ? [
            chosenPlayer,
            ...resolvedPlayerIds.filter((runtimePlayerId) => runtimePlayerId !== chosenPlayer),
          ]
        : [chosenPlayer];

    framework.status.patch({
      otp: chosenPlayer,
      turnOwnerId: chosenPlayer,
      pendingMulligan,
    });

    framework.priority.openWindow(chosenPlayer);

    for (const playerId of pendingMulligan) {
      framework.zones.shuffle({ zone: "deck", playerId });
    }

    framework.log(
      createLorcanaLogProjection(
        "lorcana.setup.firstPlayerChosen",
        {
          chooser,
          chosen: chosenPlayer,
        },
        { mode: "PUBLIC" },
        "action",
      ),
    );
  },

  available: ({ framework }) => {
    const resolvedPlayerIds = resolveRuntimePlayerIds({
      playerIds: framework.state.playerIds,
      _zonesPrivate: framework.state._zonesPrivate,
    });
    return resolvedPlayerIds.length > 0;
  },
};
