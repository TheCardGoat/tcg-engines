import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
// Raw deck IDs check hidden ordering; the public view exposes only deck count.
describe("ST12-013 Zeff", () => {
  test.each(["top", "bottom"])("orders three looked cards at %s", (position) => {
    const e = OnePieceTestEngine.create({
      hand: ["ST12-013"],
      deck: ["ST12-015", "ST12-004", "ST12-009", "ST09-003"],
      activeDon: 5,
    });
    const ids = ["ST12-009", "ST12-015", "ST12-004"].map((c) =>
      e.findCardInZone("south", "deck", c),
    );
    e.playCard("ST12-013");
    e.resolveDecision("effectRearrangeDeckOrder", { selectedIds: ids }, "south");
    e.resolveDecision("effectRearrangeDeckPosition", { optionId: position }, "south");
    const deck = e.getState().players.south.deck;
    expect(position === "top" ? deck.slice(0, 3) : deck.slice(-3)).toEqual(ids);
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("ST12-013");
  });
  test("attack plays only revealed exact-cost-two Character rested", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "ST12-013", playedOnTurn: 0 }],
        hand: ["ST12-015"],
        deck: ["ST12-015", "ST12-004"],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "deck", "ST12-015");
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-013"), e.leader("north"));
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.asSouth().choosePlay(id);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("declines optional revealed play and sends remainder to bottom", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-013", playedOnTurn: 0 }], deck: ["ST12-015", "ST12-004"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "deck", "ST12-015");
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-013"), e.leader("north"));
    e.asSouth().chooseNoPlay();
    e.resolveDecision("effectRevealedDeckPosition", { optionId: "bottom" }, "south");
    expect(e.getState().players.south.deck.at(-1)).toBe(id);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });
  test.each(["ST12-009", "ST12-016"])("rejects wrong revealed cost/category %s", (card) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-013", playedOnTurn: 0 }], deck: [card, "ST12-004"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-013"), e.leader("north"));
    e.resolveDecision("effectRevealedDeckPosition", { optionId: "top" }, "south");
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.south.deckCount).toBe(2);
  });
});
