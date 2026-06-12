import { describe, expect, it } from "vitest";

import { gundamMoves } from "./index.ts";
import type { GundamMoveName } from "./move-name.ts";
import { GUNDAM_MOVE_METADATA, getMoveMetadata } from "./metadata.ts";

describe("GUNDAM_MOVE_METADATA", () => {
  it("covers every move in gundamMoves", () => {
    const moveNames = Object.keys(gundamMoves).sort();
    const metadataKeys = Object.keys(GUNDAM_MOVE_METADATA).sort();
    expect(metadataKeys).toEqual(moveNames);
  });

  it("has no metadata entries without a backing move", () => {
    for (const key of Object.keys(GUNDAM_MOVE_METADATA) as GundamMoveName[]) {
      expect(gundamMoves[key], `metadata for unknown move "${key}"`).toBeDefined();
    }
  });

  it("sets id equal to the registry key", () => {
    for (const [key, meta] of Object.entries(GUNDAM_MOVE_METADATA)) {
      expect(meta.id).toBe(key);
    }
  });

  it("uses non-empty labels", () => {
    for (const meta of Object.values(GUNDAM_MOVE_METADATA)) {
      expect(meta.label.trim().length).toBeGreaterThan(0);
    }
  });

  it("does not reuse hotkeys across moves", () => {
    const hotkeys = Object.values(GUNDAM_MOVE_METADATA)
      .map((m) => m.hotkey)
      .filter((h): h is string => typeof h === "string");
    expect(new Set(hotkeys).size).toBe(hotkeys.length);
  });

  it("getMoveMetadata returns the registered entry", () => {
    expect(getMoveMetadata("passTurn")?.label).toBe("End Turn");
    expect(getMoveMetadata("not-a-move")).toBeUndefined();
  });
});
