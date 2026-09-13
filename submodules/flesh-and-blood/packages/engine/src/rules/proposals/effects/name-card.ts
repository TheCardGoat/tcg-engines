import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { snapshotObject } from "../../snapshots.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, unsupported } from "../shared.ts";

/**
 * CR 8.5.21 "Name a card" — bind the named identity for later predicates
 * ("cards with that name", "if they named …"). Does **not** banish or move
 * any card; follow-up sequence leaves perform those actions.
 */
export function proposeNameCard(
  ctx: ProposalContext,
  effect: FabEffect & { type: "name-card" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  const key = ctx.effectPath.join(".");
  const named = ctx.effectOptions[key];
  if (!named) return unsupported(effect, "name-card requires a chosen public card identity");

  const heroId = state.containers.zonesByPlayerId[layer.controllerId]?.heroZone[0];
  if (!heroId) return unsupported(effect, "name-card controller has no hero");
  const hero = snapshotObject(state, heroId, layer.controllerId, "heroZone");

  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "set-status",
        affected: [hero],
        bindings: {
          ...layer.bindings,
          "named-card": named,
          namedCard: named,
        },
        data: { object: hero, status: `named-card:${named}` },
      },
    ],
  };
}
