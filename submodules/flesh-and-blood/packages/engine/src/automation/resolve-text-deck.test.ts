import { describe, expect, it } from "vitest";
import { fleshAndBloodDeckCardLibrary } from "../../../cards/src/deck-library.ts";
import { FAB_DECK_TEXT_FIXTURES } from "./deck-text-fixtures.ts";
import {
  parseFabDeckTextLine,
  resolveFabDeckSelection,
  resolveFabDeckTextFixture,
  resolveSafeFabDeckSelection,
} from "./resolve-text-deck.ts";

describe("engine catalog deck resolver", () => {
  it("normalizes FaBrary || split-card names to the printed // form", () => {
    expect(parseFabDeckTextLine("3x Burn Up||Shock (red)")).toEqual({
      count: 3,
      name: "Burn Up // Shock",
      pitch: "red",
    });
    expect(parseFabDeckTextLine("3x Consign to Cosmos||Shock (yellow)")).toEqual({
      count: 3,
      name: "Consign to Cosmos // Shock",
      pitch: "yellow",
    });
  });

  it("seats gravy with one legal equipment loadout and overflow in inventory", () => {
    const seat = resolveFabDeckSelection(
      fleshAndBloodDeckCardLibrary,
      "cc-edinburgh-1st-gravy-bones",
      "resolve-test",
    );
    expect(seat.unresolved).toEqual([]);
    expect(seat.player.arena).toBeUndefined();
    expect(Array.isArray(seat.player.head) ? seat.player.head.length : 0).toBeLessThanOrEqual(1);
    expect(Array.isArray(seat.player.chest) ? seat.player.chest.length : 0).toBeLessThanOrEqual(1);
    expect(Array.isArray(seat.player.arms) ? seat.player.arms.length : 0).toBeLessThanOrEqual(1);
    expect(Array.isArray(seat.player.legs) ? seat.player.legs.length : 0).toBeLessThanOrEqual(1);
    expect(Array.isArray(seat.player.inventory) ? seat.player.inventory.length : 0).toBeGreaterThan(
      0,
    );
    expect(seat.player.hand).toHaveLength(4);
  });

  it("resolves every tournament fixture without dropping cards", () => {
    for (const fixture of FAB_DECK_TEXT_FIXTURES) {
      const seat = resolveFabDeckTextFixture(fleshAndBloodDeckCardLibrary, fixture, "resolve-all");
      expect(seat.unresolved, fixture.id).toEqual([]);
      expect(seat.player.arena, fixture.id).toBeUndefined();
      expect(seat.player.heroCardId, fixture.id).toBeTruthy();
    }
  });

  it("throws on an explicit unknown deck id and defaults only when omitted", () => {
    expect(() =>
      resolveFabDeckSelection(fleshAndBloodDeckCardLibrary, "not-a-deck", "resolve-test"),
    ).toThrow(/Unknown deck id/);
    expect(() =>
      resolveSafeFabDeckSelection(fleshAndBloodDeckCardLibrary, "not-a-deck", "resolve-test"),
    ).toThrow(/Unknown deck id/);
    expect(
      resolveSafeFabDeckSelection(fleshAndBloodDeckCardLibrary, undefined, "resolve-test").deckId,
    ).toBe("cc-edinburgh-1st-gravy-bones");
  });
});
