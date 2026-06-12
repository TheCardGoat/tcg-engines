import { describe, expect, test } from "vitest";
import {
  createEmptyZoneState,
  getBottomCard,
  getCardCount,
  getCardsInZone,
  getTopCard,
  initializeZoneState,
  makeZoneKey,
  moveCardInState,
  parseZoneKey,
  removeCardFromState,
  isOrdered,
} from "./zones.ts";
import type { ZoneConfig } from "../types/index.ts";

const testZones: Record<string, ZoneConfig> = {
  deck: {
    id: "deck",
    name: "Deck",
    visibility: "secret",
    ordered: true,
    ownerScoped: true,
    faceDown: true,
  },
  hand: { id: "hand", name: "Hand", visibility: "private", ordered: false, ownerScoped: true },
  battleArea: {
    id: "battleArea",
    name: "Battle Area",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
  },
  trash: { id: "trash", name: "Trash", visibility: "public", ordered: true, ownerScoped: true },
};

describe("makeZoneKey / parseZoneKey", () => {
  test("owner-scoped zone", () => {
    const key = makeZoneKey({ zone: "deck", playerId: "p1" });
    expect(key).toBe("deck:p1");
    expect(parseZoneKey(key)).toEqual({ zone: "deck", playerId: "p1" });
  });

  test("global zone", () => {
    const key = makeZoneKey({ zone: "trash" });
    expect(key).toBe("trash");
    expect(parseZoneKey(key)).toEqual({ zone: "trash" });
  });
});

describe("initializeZoneState", () => {
  test("creates zones for all players", () => {
    const state = initializeZoneState(testZones, ["p1", "p2"]);
    expect(getCardCount(state, { zone: "deck", playerId: "p1" })).toBe(0);
    expect(getCardCount(state, { zone: "deck", playerId: "p2" })).toBe(0);
    expect(getCardCount(state, { zone: "trash", playerId: "p1" })).toBe(0);
    expect(getCardCount(state, { zone: "trash", playerId: "p2" })).toBe(0);
  });
});

describe("isOrdered", () => {
  test("uses zone config when provided", () => {
    const state = initializeZoneState(testZones, ["p1"]);

    expect(isOrdered(state, { zone: "deck", playerId: "p1" }, testZones)).toBe(true);
    expect(isOrdered(state, { zone: "hand", playerId: "p1" }, testZones)).toBe(false);
  });

  test("falls back to whether the zone exists when config is omitted", () => {
    const state = initializeZoneState(testZones, ["p1"]);

    expect(isOrdered(state, { zone: "deck", playerId: "p1" })).toBe(true);
    expect(isOrdered(state, { zone: "missing", playerId: "p1" })).toBe(false);
  });
});

describe("moveCardInState", () => {
  test("moves card between zones", () => {
    const state = initializeZoneState(testZones, ["p1"]);
    moveCardInState(state, "c1", { zone: "deck", playerId: "p1" });
    expect(getCardsInZone(state, { zone: "deck", playerId: "p1" })).toContain("c1");

    moveCardInState(state, "c1", { zone: "hand", playerId: "p1" });
    expect(getCardsInZone(state, { zone: "hand", playerId: "p1" })).toContain("c1");
    expect(getCardsInZone(state, { zone: "deck", playerId: "p1" })).not.toContain("c1");
  });

  test("revision increments on move", () => {
    const state = initializeZoneState(testZones, ["p1"]);
    const before = state.public.zoneSummaries["deck:p1"]!.revision;
    moveCardInState(state, "c1", { zone: "deck", playerId: "p1" });
    expect(state.public.zoneSummaries["deck:p1"]!.revision).toBe(before + 1);
  });

  test("top card updates", () => {
    const state = initializeZoneState(testZones, ["p1"]);
    moveCardInState(state, "c1", { zone: "deck", playerId: "p1" });
    moveCardInState(state, "c2", { zone: "deck", playerId: "p1" });
    expect(getTopCard(state, { zone: "deck", playerId: "p1" })).toBe("c2");
    expect(getBottomCard(state, { zone: "deck", playerId: "p1" })).toBe("c1");
  });

  test("reindexes cards on middle insertion", () => {
    const state = initializeZoneState(testZones, ["p1"]);
    moveCardInState(state, "c1", { zone: "deck", playerId: "p1" });
    moveCardInState(state, "c2", { zone: "deck", playerId: "p1" });
    moveCardInState(state, "c3", { zone: "deck", playerId: "p1" });

    // Insert c3 at index 1 (between c1 and c2)
    moveCardInState(state, "c3", { zone: "deck", playerId: "p1" }, { index: 1 });

    expect(getCardsInZone(state, { zone: "deck", playerId: "p1" })).toEqual(["c1", "c3", "c2"]);
    expect(state.private.cardIndex["c1"]?.index).toBe(0);
    expect(state.private.cardIndex["c3"]?.index).toBe(1);
    expect(state.private.cardIndex["c2"]?.index).toBe(2);
  });
});

describe("removeCardFromState", () => {
  test("removes card from zone", () => {
    const state = initializeZoneState(testZones, ["p1"]);
    moveCardInState(state, "c1", { zone: "deck", playerId: "p1" });
    expect(removeCardFromState(state, "c1")).toBe(true);
    expect(getCardsInZone(state, { zone: "deck", playerId: "p1" })).not.toContain("c1");
  });

  test("returns false for missing card", () => {
    const state = createEmptyZoneState();
    expect(removeCardFromState(state, "missing")).toBe(false);
  });
});
