/**
 * State serialization helpers for network transport and storage.
 *
 * Uses mutative's patch format internally but converts patches to a
 * JSON-safe representation for wire transport.
 */

import { create, apply } from "mutative";
import type { Patches, Patch } from "mutative";

import type { MatchState } from "../types/match-state.ts";

// ── Serialized state ────────────────────────────────────────────────────────

export interface SerializedMatchState {
  version: string;
  stateID: number;
  G: unknown;
  ctx: unknown;
}

const SERIALIZATION_VERSION = "1.0.0";

/**
 * Serialize a MatchState to a JSON-safe object suitable for
 * network transport or persistent storage.
 */
export function serializeState(state: MatchState): SerializedMatchState {
  return {
    version: SERIALIZATION_VERSION,
    stateID: state.ctx._stateID,
    G: structuredClone(state.G),
    ctx: structuredClone(state.ctx),
  };
}

/**
 * Deserialize a SerializedMatchState back into a MatchState.
 */
export function deserializeState(data: SerializedMatchState): MatchState {
  if (!data.version) {
    throw new Error("Missing version in serialized state");
  }
  return {
    G: structuredClone(data.G) as object,
    ctx: structuredClone(data.ctx) as MatchState["ctx"],
  };
}

// ── Delta / Patch system ────────────────────────────────────────────────────

/**
 * A JSON-safe patch operation. Mirrors mutative's Patch format but
 * ensures all values are JSON-serializable.
 */
export interface JsonPatch {
  op: "add" | "replace" | "remove";
  path: (string | number)[];
  value?: unknown;
}

export interface StateDelta {
  stateID: number;
  patches: JsonPatch[];
}

/**
 * Convert a mutative Patch to a JSON-safe JsonPatch.
 * Mutative patches already use { op, path, value } but the value
 * may contain non-JSON-safe types (Map, Set, undefined, etc.).
 * We structuredClone to strip prototypes, then handle edge cases.
 */
function toJsonPatch(patch: Patch): JsonPatch {
  const jsonPatch: JsonPatch = {
    op: patch.op as JsonPatch["op"],
    path: Array.isArray(patch.path) ? [...patch.path] : [patch.path as string],
  };

  if (patch.op !== "remove" && "value" in patch) {
    // structuredClone handles most cases; JSON round-trip ensures
    // the value is truly JSON-safe (strips undefined, functions, etc.)
    try {
      jsonPatch.value = JSON.parse(JSON.stringify(patch.value));
    } catch {
      // If value can't be JSON-serialized, store null as fallback
      jsonPatch.value = null;
    }
  }

  return jsonPatch;
}

/**
 * Convert a JsonPatch back to a mutative-compatible Patch.
 */
function fromJsonPatch(jsonPatch: JsonPatch): Patch {
  const patch: Patch = {
    op: jsonPatch.op,
    path: jsonPatch.path,
  };

  if (jsonPatch.op !== "remove" && "value" in jsonPatch) {
    (patch as Patch & { value: unknown }).value = jsonPatch.value;
  }

  return patch;
}

/**
 * Compute the delta (set of patches) between two states.
 * Uses mutative's create() to derive patches by transforming
 * prev into next.
 */
export function computeStateDelta(prev: MatchState, next: MatchState): StateDelta {
  const [, patches] = create(
    prev,
    (draft) => {
      // Deep-assign next state onto the draft
      Object.assign(draft.G, structuredClone(next.G));
      Object.assign(draft.ctx, structuredClone(next.ctx));

      // Handle keys that may have been removed from G
      for (const key of Object.keys(draft.G as Record<string, unknown>)) {
        if (!(key in (next.G as Record<string, unknown>))) {
          delete (draft.G as Record<string, unknown>)[key];
        }
      }
    },
    { enablePatches: true },
  );

  return {
    stateID: next.ctx._stateID,
    patches: (patches as Patches).map(toJsonPatch),
  };
}

/**
 * Apply a StateDelta to a state to produce the next state.
 * Uses mutative's apply() with the converted patches.
 */
export function applyStateDelta(state: MatchState, delta: StateDelta): MatchState {
  const mutativePatches: Patches = delta.patches.map(fromJsonPatch);
  return apply(state, mutativePatches) as MatchState;
}
