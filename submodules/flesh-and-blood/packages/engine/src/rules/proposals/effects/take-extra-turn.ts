import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { snapshotObject } from "../../snapshots.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, playersForFabPlayer, unsupported } from "../shared.ts";

/**
 * CR "take an extra turn after this one" — queue one extra turn for the
 * targeted player. Observed via `player.extraTurnsQueued` (incremented when
 * set-status `"extra-turn-queued"` reduces on the hero).
 */
export function proposeTakeExtraTurn(
  ctx: ProposalContext,
  effect: FabEffect & { type: "take-extra-turn" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  const playerIds = playersForFabPlayer(state, layer.controllerId, effect.player, layer.bindings);
  if (!playerIds || playerIds.length !== 1) {
    return unsupported(effect, "take-extra-turn requires one deterministic player");
  }
  const playerId = playerIds[0]!;
  const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
  if (!heroId) return unsupported(effect, "take-extra-turn target has no hero");
  const hero = snapshotObject(state, heroId, playerId, "heroZone");
  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "set-status",
        affected: [hero],
        data: { object: hero, status: "extra-turn-queued" },
      },
    ],
  };
}
