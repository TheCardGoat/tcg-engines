import { describe, expect, it } from "bun:test";
import { createPlayerId } from "../types";
import {
  buildZoneRegistry,
  initializeZoneStateFromRegistry,
  resolveZoneIdFromRegistry,
} from "./zone-registry";
import type { ZoneRuntimeDef } from "./types";

const PLAYER_ONE = createPlayerId("p1");
const PLAYER_TWO = createPlayerId("p2");

const testZones: Record<string, ZoneRuntimeDef> = {
  deck: {
    id: "deck",
    name: "Deck",
    visibility: "secret",
    ordered: true,
    ownerScoped: true,
  },
  hand: {
    id: "hand",
    name: "Hand",
    visibility: "private",
    ordered: false,
    ownerScoped: true,
  },
  play: {
    id: "play",
    name: "Play",
    visibility: "public",
    ordered: true,
    ownerScoped: false,
  },
};

describe("zone-registry", () => {
  it("expands owner-scoped zones for each player", () => {
    const zoneRegistry = buildZoneRegistry(testZones, ["p1", "p2"]);

    expect(Object.keys(zoneRegistry).sort()).toEqual([
      "deck",
      "deck:p1",
      "deck:p2",
      "hand",
      "hand:p1",
      "hand:p2",
      "play",
    ]);
  });

  it("initializes zone state entries for every registry zone", () => {
    const zoneRegistry = buildZoneRegistry(testZones, ["p1", "p2"]);
    const zoneSummaries: Record<string, unknown> = {};
    const zoneCards: Record<string, unknown> = {};

    initializeZoneStateFromRegistry(zoneSummaries, zoneCards, zoneRegistry);

    expect(zoneSummaries).toEqual({
      deck: { revision: 0, count: 0 },
      "deck:p1": { revision: 0, count: 0 },
      "deck:p2": { revision: 0, count: 0 },
      hand: { revision: 0, count: 0 },
      "hand:p1": { revision: 0, count: 0 },
      "hand:p2": { revision: 0, count: 0 },
      play: { revision: 0, count: 0 },
    });
    expect(zoneCards).toEqual({
      deck: [],
      "deck:p1": [],
      "deck:p2": [],
      hand: [],
      "hand:p1": [],
      "hand:p2": [],
      play: [],
    });
  });

  it("resolves owner-scoped zone refs to the player's scoped zone id", () => {
    const zoneRegistry = buildZoneRegistry(testZones, ["p1", "p2"]);

    expect(resolveZoneIdFromRegistry({ zone: "deck", playerId: "p1" }, zoneRegistry, {})).toBe(
      "deck:p1",
    );
  });

  it("throws when an explicit scoped zone id mismatches the provided player", () => {
    const zoneRegistry = buildZoneRegistry(testZones, ["p1", "p2"]);

    expect(() =>
      resolveZoneIdFromRegistry({ zone: "deck:p1", playerId: "p2" }, zoneRegistry, {}),
    ).toThrow("Zone player mismatch for deck:p1");
  });

  it("throws when an owner-scoped zone is queried without a player id", () => {
    const zoneRegistry = buildZoneRegistry(testZones, ["p1", "p2"]);

    expect(() => resolveZoneIdFromRegistry({ zone: "deck" }, zoneRegistry, {})).toThrow(
      "Owner-scoped zone requires player id: deck",
    );
  });

  it("throws when a player-scoped zone is requested for a player with no matching cards", () => {
    const zoneRegistry = buildZoneRegistry(testZones, [PLAYER_ONE, PLAYER_TWO]);
    const cardIndex = {
      "card-1": {
        ownerID: PLAYER_ONE,
        controllerID: PLAYER_ONE,
      },
    };

    expect(() =>
      resolveZoneIdFromRegistry({ zone: "deck", playerId: "p3" }, zoneRegistry, cardIndex),
    ).toThrow("Unknown zone: deck");
  });
});
