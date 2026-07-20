import { describe, expect, it } from "vite-plus/test";

import { GUNDAM_ANIMATION_INVENTORY } from "./inventory.ts";

describe("Gundam animation inventory", () => {
  it("uses stable unique ids and actionable proof metadata", () => {
    const ids = GUNDAM_ANIMATION_INVENTORY.map((entry) => entry.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const entry of GUNDAM_ANIMATION_INVENTORY) {
      expect(entry.playerSignal.length).toBeGreaterThan(12);
      expect(entry.engineTrigger.length).toBeGreaterThan(3);
      expect(entry.implementation.length).toBeGreaterThan(3);
      expect(entry.exercise.length).toBeGreaterThan(3);
      if (entry.coverage === "browser-validated") {
        expect(entry.visualFixture).not.toBeNull();
      }
    }
  });

  it("covers every source-derived gameplay family", () => {
    expect(new Set(GUNDAM_ANIMATION_INVENTORY.map((entry) => entry.family))).toEqual(
      new Set([
        "setup",
        "zone-transfer",
        "command-effect",
        "combat",
        "state-economy",
        "flow",
        "interaction",
      ]),
    );
  });
});
