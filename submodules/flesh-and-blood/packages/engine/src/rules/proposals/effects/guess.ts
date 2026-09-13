import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { snapshotObject } from "../../snapshots.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, playersForFabPlayer, unsupported } from "../shared.ts";

/**
 * Bind the guesser's yes/no answer to whether the hidden card matches the
 * defender's existing chosen color. The later conditional compares that
 * answer with the bound card without exposing or overwriting either choice.
 */
export function proposeGuess(
  ctx: ProposalContext,
  effect: FabEffect & { type: "guess" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  const guesserIds = playersForFabPlayer(state, layer.controllerId, effect.guesser, layer.bindings);
  if (!guesserIds || guesserIds.length !== 1) {
    return unsupported(effect, "guess guesser is unresolved");
  }
  const guesserId = guesserIds[0]!;
  const key = ctx.effectPath.join(".");
  const guess = ctx.effectOptions[key] ?? "yes";
  if (guess !== "yes" && guess !== "no") {
    return unsupported(effect, "guess answer must be yes or no");
  }

  const heroId = state.containers.zonesByPlayerId[guesserId]?.heroZone[0];
  if (!heroId) return unsupported(effect, "guess guesser has no hero");
  const hero = snapshotObject(state, heroId, guesserId, "heroZone");

  return {
    supported: true,
    events: [
      {
        ...baseEvent(layer, processId),
        name: "set-status",
        affected: [hero],
        bindings: {
          ...layer.bindings,
          "guessed-match": guess,
          "guessed-binding": effect.binding,
        },
        data: { object: hero, status: `guessed-${guess}` },
      },
    ],
  };
}
