import { describe, expect, it } from "vitest";
import { createEmptyFabZones, createFabContainerModel } from "./zones.ts";

describe("createFabContainerModel", () => {
  it("rejects a runtime player without stable arsenal-slot identities", () => {
    expect(() =>
      createFabContainerModel({
        zonesByPlayerId: { p1: createEmptyFabZones() },
        arsenalZonesByPlayerId: {},
        subcardsByHostId: {},
      }),
    ).toThrowError("FAB player p1 is missing its runtime arsenal-slot index.");
  });
});
