/**
 * Typed enumeration of every move registered in `gundamMoves`. Derived from
 * the registry's literal keys via `as const satisfies MoveRecord`, so
 * adding a move to the registry automatically widens `GundamMoveName` and
 * forces every exhaustive consumer (candidate dispatch, move-input
 * binding, family policies) to handle the new variant at compile time.
 *
 * The dual `const` array exists so runtime code (tests, registry-parity
 * checks, generated UI hotkey lists) can iterate over the same set the
 * type guards.
 */

import type { MoveDefinition } from "../../types/move-types.ts";
import type { GundamG } from "../types.ts";
import { gundamMoves } from "./index.ts";

export type GundamMoveName = keyof typeof gundamMoves;

export const GUNDAM_MOVE_NAMES = Object.keys(gundamMoves) as readonly GundamMoveName[];

export function isGundamMoveName(value: string): value is GundamMoveName {
  return Object.hasOwn(gundamMoves, value);
}

/**
 * Runtime lookup that returns the registered move widened to a generic
 * `MoveDefinition<unknown, GundamG>` shape. Use this from call sites
 * (e.g. the command dispatcher) that need a uniform handle on the
 * `validate` / `execute` methods without statically knowing the input
 * type for the specific move. The registry's literal keys are still the
 * source of truth for `GundamMoveName`; only the value type is widened
 * here.
 */
export function getGundamMoveDefinition(name: GundamMoveName): MoveDefinition<unknown, GundamG> {
  return gundamMoves[name] as unknown as MoveDefinition<unknown, GundamG>;
}
