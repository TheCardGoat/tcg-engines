import type { JsonPatch } from "./json-patch.js";
import type { ReplayCheckpoint, ReplayFile, ReplayPlaybackV1 } from "./replay.js";

/**
 * Materialize the replay state at a cursor from the nearest checkpoint.
 * Replay playback, replay forks, and debug exports share this exact function.
 */
export function materializeReplayStateAtCursor(
  replay: Pick<ReplayFile, "initialState" | "checkpoints" | "steps">,
  cursor: number,
  additionalCheckpoints: readonly ReplayCheckpoint[] = [],
): unknown {
  const target = Math.max(0, Math.min(Math.trunc(cursor), replay.steps.length));
  const checkpoints = new Map<number, unknown>([[0, replay.initialState]]);
  for (const checkpoint of [...replay.checkpoints, ...additionalCheckpoints]) {
    if (checkpoint.cursor <= replay.steps.length) {
      checkpoints.set(checkpoint.cursor, checkpoint.state);
    }
  }
  let nearestCursor = 0;
  for (const checkpointCursor of checkpoints.keys()) {
    if (checkpointCursor <= target && checkpointCursor > nearestCursor) {
      nearestCursor = checkpointCursor;
    }
  }
  let state = structuredClone(checkpoints.get(nearestCursor));
  for (let index = nearestCursor; index < target; index += 1) {
    state = applyReplayPatch(state, replay.steps[index]!.patches);
  }
  return state;
}

/** Apply the canonical RFC 6902 replay patch format without mutating its input. */
export function applyReplayPatch(root: unknown, patches: JsonPatch): unknown {
  let result = structuredClone(root);
  for (const patch of patches) {
    if (patch.op === "test") continue;
    if (patch.op === "move" || patch.op === "copy") {
      const value = readPointer(result, patch.from);
      if (patch.op === "move") result = mutatePointer(result, "remove", patch.from);
      result = mutatePointer(result, "add", patch.path, structuredClone(value));
      continue;
    }
    result = mutatePointer(
      result,
      patch.op,
      patch.path,
      "value" in patch ? patch.value : undefined,
    );
  }
  return result;
}

function mutatePointer(
  root: unknown,
  op: "add" | "remove" | "replace",
  pointer: string,
  value?: unknown,
): unknown {
  const segments = parsePointer(pointer);
  if (segments.length === 0) return op === "remove" ? null : structuredClone(value);
  const parent = segments.slice(0, -1).reduce<unknown>((current, key) => {
    if (Array.isArray(current)) return current[Number(key)];
    if (isRecord(current)) return current[key];
    throw new Error(`Invalid replay patch path: ${pointer}`);
  }, root);
  const key = segments.at(-1)!;
  if (Array.isArray(parent)) {
    // Early V3 recordings serialized Mutative's array shrink operation verbatim.
    // Decode those immutable recordings; new writers emit RFC 6902 removals.
    if (
      key === "length" &&
      op === "replace" &&
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 0 &&
      value <= parent.length
    ) {
      parent.splice(value);
      return root;
    }
    const index = key === "-" ? parent.length : Number(key);
    if (!Number.isInteger(index)) throw new Error(`Invalid replay array path: ${pointer}`);
    if (op === "remove") parent.splice(index, 1);
    else if (op === "add") parent.splice(index, 0, structuredClone(value));
    else parent[index] = structuredClone(value);
  } else if (isRecord(parent)) {
    if (op === "remove") delete parent[key];
    else parent[key] = structuredClone(value);
  } else {
    throw new Error(`Invalid replay patch parent: ${pointer}`);
  }
  return root;
}

function readPointer(root: unknown, pointer: string): unknown {
  return parsePointer(pointer).reduce<unknown>((current, key) => {
    if (Array.isArray(current)) return current[Number(key)];
    if (isRecord(current)) return current[key];
    throw new Error(`Invalid replay pointer: ${pointer}`);
  }, root);
}

function parsePointer(pointer: string): string[] {
  if (pointer === "") return [];
  if (!pointer.startsWith("/")) throw new Error(`Invalid JSON pointer: ${pointer}`);
  return pointer
    .slice(1)
    .split("/")
    .map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Materialize mutable resources independently when a legacy checkpoint lacks them. */
export function materializeReplayFrameAtCursor(
  playback: Pick<
    ReplayPlaybackV1,
    "replay" | "resources" | "presentation" | "presentationBindings"
  >,
  cursor: number,
): {
  state: unknown;
  resources?: unknown;
  presentation?: ReplayPlaybackV1["presentation"];
  presentationBindings?: ReplayPlaybackV1["presentationBindings"];
} {
  const { replay } = playback;
  const target = Math.max(0, Math.min(Math.trunc(cursor), replay.steps.length));
  let resourceCursor = 0;
  let presentationBindings = playback.presentationBindings;
  let bindingCursor = 0;
  for (const checkpoint of replay.checkpoints) {
    if (
      checkpoint.cursor <= target &&
      checkpoint.cursor >= bindingCursor &&
      checkpoint.presentationBindings
    ) {
      bindingCursor = checkpoint.cursor;
      presentationBindings = checkpoint.presentationBindings;
    }
  }
  // Bindings replace the previous instance map, including explicit empty maps.
  for (let index = bindingCursor; index < target; index++) {
    presentationBindings = replay.steps[index]?.presentationBindings ?? presentationBindings;
  }
  let hasResources = Object.hasOwn(playback, "resources");
  let resources = structuredClone(playback.resources);
  for (const checkpoint of replay.checkpoints) {
    if (
      checkpoint.cursor <= target &&
      checkpoint.cursor >= resourceCursor &&
      Object.hasOwn(checkpoint, "resources")
    ) {
      resourceCursor = checkpoint.cursor;
      resources = structuredClone(checkpoint.resources);
      hasResources = true;
    }
  }
  for (let index = resourceCursor; index < target; index++) {
    const patches = replay.steps[index]!.resourcePatches;
    if (patches) {
      resources = applyReplayPatch(resources, patches);
      const rootChange = patches.findLast((patch) => patch.path === "" && patch.op !== "test");
      hasResources = rootChange?.op === "remove" ? false : patches.length > 0 ? true : hasResources;
    }
  }
  return {
    state: materializeReplayStateAtCursor(replay, target),
    ...(hasResources ? { resources } : {}),
    ...(presentationBindings ? { presentationBindings } : {}),
    ...(playback.presentation ? { presentation: playback.presentation } : {}),
  };
}
