import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { snapshotObject } from "../../snapshots.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, unsupported } from "../shared.ts";

export const FAB_PITCH_COLORS = ["red", "yellow", "blue"] as const;
export type FabPitchColor = (typeof FAB_PITCH_COLORS)[number];

export function isFabPitchColor(value: string): value is FabPitchColor {
  return (FAB_PITCH_COLORS as readonly string[]).includes(value);
}

/**
 * CR "Choose a color" — bind the chosen pitch color for later predicates /
 * sequence steps. Does **not** invent follow-up game actions; those are
 * separate effect steps that read `chosen-color` / `chose-<color>` status.
 *
 * The public Red/Yellow/Blue chooser is an `effect-resolution` decision
 * (name-card pattern). Proposal requires that answer; it does not default red.
 */
export function proposeChooseColor(
  ctx: ProposalContext,
  effect: FabEffect & { type: "choose-color" },
): FabEffectProposalResult {
  void effect;
  const { state, layer, processId } = ctx;
  const key = ctx.effectPath.join(".");
  const chosen = ctx.effectOptions[key];
  if (!chosen) {
    return unsupported(effect, "choose-color has no public color answer");
  }
  if (!isFabPitchColor(chosen)) {
    return unsupported(effect, "choose-color option is not a legal pitch color");
  }

  const heroId = state.containers.zonesByPlayerId[layer.controllerId]?.heroZone[0];
  if (!heroId) return unsupported(effect, "choose-color controller has no hero");
  const hero = snapshotObject(state, heroId, layer.controllerId, "heroZone");

  // CR-readable chose-<color> status on the chooser hero (Warmonger-style
  // "If they choose …" branches read this status).
  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "set-status",
        affected: [hero],
        bindings: {
          ...layer.bindings,
          "chosen-color": chosen,
          chosenColor: chosen,
          [`chose-${chosen}`]: true,
        },
        data: { object: hero, status: `chose-${chosen}` },
      },
    ],
  };
}
