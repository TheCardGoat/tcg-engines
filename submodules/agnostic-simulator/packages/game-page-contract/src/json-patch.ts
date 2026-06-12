/**
 * RFC 6902 JSON Patch operation. The page layer treats patches opaquely and
 * forwards them to the deployable's `applyPatches`. Live updates and replay
 * step deltas use the same shape so a single materializer drives both pages.
 */
export type JsonPatchOp =
  | { op: "add"; path: string; value: unknown }
  | { op: "remove"; path: string }
  | { op: "replace"; path: string; value: unknown }
  | { op: "move"; from: string; path: string }
  | { op: "copy"; from: string; path: string }
  | { op: "test"; path: string; value: unknown };

export type JsonPatch = JsonPatchOp[];
