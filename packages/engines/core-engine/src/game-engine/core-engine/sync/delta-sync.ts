/**
 * Delta Synchronization Utilities
 *
 * Provides utilities for working with Immer patches for network synchronization
 * in multiplayer card games. Enables efficient state synchronization using delta updates.
 */

import { applyPatches, type Patch } from "immer";

/**
 * Serializes Immer patches to a JSON string for network transmission.
 *
 * @param patches - Array of Immer patches to serialize
 * @returns JSON string representation of the patches
 *
 * @example
 * const patches: Patch[] = [{ op: "replace", path: ["count"], value: 5 }];
 * const json = serializePatches(patches);
 * // json = '[{"op":"replace","path":["count"],"value":5}]'
 */
export function serializePatches(patches: Patch[]): string {
  return JSON.stringify(patches);
}

/**
 * Deserializes a JSON string back to Immer patches.
 *
 * @param json - JSON string containing serialized patches
 * @returns Array of Immer patches
 * @throws Error if JSON is invalid or not an array
 *
 * @example
 * const json = '[{"op":"replace","path":["count"],"value":5}]';
 * const patches = deserializePatches(json);
 * // patches = [{ op: "replace", path: ["count"], value: 5 }]
 */
export function deserializePatches(json: string): Patch[] {
  const parsed = JSON.parse(json);

  if (!Array.isArray(parsed)) {
    throw new Error("Deserialized JSON must be an array of patches");
  }

  return parsed as Patch[];
}

/**
 * Applies patches to a state object immutably using Immer.
 *
 * @param state - The current state to apply patches to
 * @param patches - Array of patches to apply
 * @returns New state with patches applied (original state unchanged)
 *
 * @example
 * const state = { count: 0, items: ["a"] };
 * const patches: Patch[] = [{ op: "replace", path: ["count"], value: 5 }];
 * const newState = applyPatchesToState(state, patches);
 * // newState = { count: 5, items: ["a"] }
 * // state remains unchanged
 */
export function applyPatchesToState<T>(state: T, patches: Patch[]): T {
  // Special case: empty patches should still return a new object
  if (patches.length === 0) {
    // Create shallow copy for objects and arrays, or return primitives as-is
    if (Array.isArray(state)) {
      return [...state] as T;
    }
    if (state !== null && typeof state === "object") {
      return { ...state };
    }
    return state;
  }

  return applyPatches(state, patches);
}

/**
 * Returns inverse patches for undo functionality.
 *
 * Note: This function is a placeholder. In practice, use Immer's produceWithPatches
 * which returns inverse patches automatically as the third element of the tuple.
 *
 * @param patches - Forward patches
 * @returns Inverse patches (not implemented - use produceWithPatches instead)
 *
 * @example
 * // Use produceWithPatches to get inverse patches automatically:
 * const [newState, patches, inversePatches] = produceWithPatches(state, draft => {
 *   draft.count = 5;
 * });
 * // Then apply inverse patches to undo:
 * const undoneState = applyPatches(newState, inversePatches);
 */
export function reversePatch(_patches: Patch[]): Patch[] {
  // This is intentionally not implemented.
  // Immer's produceWithPatches already returns inverse patches as the third element.
  // Users should use produceWithPatches directly instead of calling this function.
  throw new Error(
    "reversePatch is not implemented. Use produceWithPatches which returns inverse patches automatically.",
  );
}

/**
 * Applies multiple patch arrays in sequence.
 *
 * @param state - Initial state
 * @param patchBatches - Array of patch arrays to apply sequentially
 * @returns Final state after all patch batches applied
 *
 * @example
 * const state = { count: 0 };
 * const batch1: Patch[] = [{ op: "replace", path: ["count"], value: 5 }];
 * const batch2: Patch[] = [{ op: "replace", path: ["count"], value: 10 }];
 * const newState = batchApplyPatches(state, [batch1, batch2]);
 * // newState = { count: 10 }
 */
export function batchApplyPatches<T>(state: T, patchBatches: Patch[][]): T {
  return patchBatches.reduce(
    (currentState, patches) => applyPatchesToState(currentState, patches),
    state,
  );
}

/**
 * Validation result for a single patch.
 */
export type PatchValidationResult = {
  /** Whether the patch is valid */
  valid: boolean;
  /** Array of error messages (empty if valid) */
  errors: string[];
};

/**
 * Validates a single Immer patch structure.
 *
 * @param patch - Patch to validate
 * @returns Validation result with valid flag and error messages
 *
 * @example
 * const patch: Patch = { op: "replace", path: ["count"], value: 5 };
 * const result = validatePatch(patch);
 * // result = { valid: true, errors: [] }
 *
 * const invalidPatch = { op: "invalid", path: ["count"] } as unknown as Patch;
 * const result2 = validatePatch(invalidPatch);
 * // result2 = { valid: false, errors: ["Invalid op: must be add, remove, or replace"] }
 */
export function validatePatch(patch: Patch): PatchValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (!patch.op) {
    errors.push("Missing required field: op");
  }

  if (!patch.path) {
    errors.push("Missing required field: path");
  }

  // Validate op value
  if (patch.op && !["add", "remove", "replace"].includes(patch.op)) {
    errors.push("Invalid op: must be add, remove, or replace");
  }

  // Validate path is an array
  if (patch.path && !Array.isArray(patch.path)) {
    errors.push("path must be an array");
  }

  // Validate add and replace operations have a value
  if ((patch.op === "add" || patch.op === "replace") && !("value" in patch)) {
    errors.push(`${patch.op} operation requires a value field`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validation result for an array of patches.
 */
export type PatchesValidationResult = {
  /** Whether all patches are valid */
  valid: boolean;
  /** Array of invalid patches with their indices and errors */
  invalidPatches: Array<{
    index: number;
    errors: string[];
  }>;
};

/**
 * Validates an array of patches.
 *
 * @param patches - Array of patches to validate
 * @returns Validation result with valid flag and details of invalid patches
 *
 * @example
 * const patches: Patch[] = [
 *   { op: "replace", path: ["count"], value: 5 },
 *   { op: "add", path: ["items", 0], value: "new" }
 * ];
 * const result = validatePatches(patches);
 * // result = { valid: true, invalidPatches: [] }
 *
 * const mixedPatches = [
 *   { op: "replace", path: ["count"], value: 5 },
 *   { op: "invalid", path: ["bad"] } // Invalid
 * ] as unknown as Patch[];
 * const result2 = validatePatches(mixedPatches);
 * // result2 = {
 * //   valid: false,
 * //   invalidPatches: [{ index: 1, errors: [...] }]
 * // }
 */
export function validatePatches(patches: Patch[]): PatchesValidationResult {
  const invalidPatches: Array<{ index: number; errors: string[] }> = [];

  for (let i = 0; i < patches.length; i++) {
    const result = validatePatch(patches[i]);
    if (!result.valid) {
      invalidPatches.push({
        index: i,
        errors: result.errors,
      });
    }
  }

  return {
    valid: invalidPatches.length === 0,
    invalidPatches,
  };
}
