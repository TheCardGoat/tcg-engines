/**
 * Move procedure query — UI-facing multi-step picker driver.
 *
 * Given a move name and the client's in-progress input, returns the ordered
 * list of `MoveStepOption` entries the UI should render next. Moves opt in
 * by defining a `describeProcedure` hook.
 *
 * Moves without the hook return an empty step list — the UI treats that
 * as "the seed is the entire input, submit immediately". Moves that want
 * a confirmation gate (destructive, high-cost, or otherwise worth a
 * sanity-check) must define `describeProcedure` and return `[{ kind:
 * "confirm" }]` themselves. Explicit > implicit; the previous default of
 * "always confirm" pushed the friction onto every player by default.
 */

import type { PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type { DeepReadonly, MoveProcedureContext, MoveStepOption } from "../types/move-types.ts";

import { buildReadAPI } from "./match-runtime.queries.ts";
import type { MatchStaticResources } from "./static-resources.ts";
import { getGundamMoveDefinition, isGundamMoveName } from "../gundam/moves/move-name.ts";
import type { GundamG } from "../gundam/types.ts";

/**
 * Return the next-step options for a move given the client's in-progress
 * input. UI calls this after each user selection to learn what to render
 * next. Returns `undefined` for unknown moves.
 */
export function getMoveProcedure(
  state: MatchState,
  staticResources: MatchStaticResources,
  playerId: PlayerId,
  moveName: string,
  partialInput: Readonly<Record<string, unknown>> = {},
): readonly MoveStepOption[] | undefined {
  if (!isGundamMoveName(moveName)) return undefined;
  const moveDef = getGundamMoveDefinition(moveName);

  const frameworkRead = buildReadAPI(state, staticResources);
  const ctx: MoveProcedureContext<GundamG> = {
    G: state.G as DeepReadonly<GundamG>,
    playerId,
    partialInput,
    cards: frameworkRead.cards,
    framework: frameworkRead,
  };

  if (!moveDef.describeProcedure) return [];

  try {
    return moveDef.describeProcedure(ctx);
  } catch {
    // Buggy describeProcedure: fall back to a confirm gate so the user
    // doesn't auto-submit a move whose procedure threw mid-evaluation.
    return [{ kind: "confirm" }];
  }
}
