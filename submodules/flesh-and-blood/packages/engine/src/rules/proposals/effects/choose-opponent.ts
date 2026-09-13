import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { opponentOf } from "../../../state.ts";
import type { FabMatchState } from "../../../state.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, unsupported } from "../shared.ts";

/**
 * “Choose an opponent” — **1v1 product rule**.
 *
 * There is always exactly one opposing seat. This leaf never opens a chooser:
 * it binds that seat via `opponentOf` and emits an observation event so later
 * sequence steps / delayed triggers can read `chosen-opponent` / `opponent`
 * bindings. Multiplayer candidate sets are out of product scope
 * (see `submodules/flesh-and-blood/AGENTS.md` Product Scope — 1v1 Only).
 */
export function proposeChooseOpponent(
  ctx: ProposalContext,
  effect: FabEffect & { type: "choose-opponent" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  if (state.playerIds.length !== 2) {
    return unsupported(
      effect,
      "choose-opponent is 1v1-only (exactly two seated players); multiplayer is out of product scope",
    );
  }
  let opponentId: string;
  try {
    opponentId = opponentOf(state as FabMatchState, layer.controllerId);
  } catch {
    return unsupported(effect, "choose-opponent could not resolve the sole opposing seat");
  }

  const bindings = {
    ...layer.bindings,
    /** Canonical binding for “the chosen opponent” (always the sole opponent). */
    "chosen-opponent": opponentId,
    /** Alias used by some card models / delayed filters. */
    opponent: opponentId,
  };

  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "choose-opponent",
        affected: [],
        bindings,
        data: {
          actorId: layer.controllerId,
          opponentId,
        },
      },
    ],
  };
}
