import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-004 Jewelry Bonney", () => {
  test.each([1, 2])("battle KO uses the pre-removal attached DON count %s", (don) => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "ST21-004", rested: true, attachedDon: don }],
        deck: ["ST21-005", "ST21-006"],
      },
      { character: [{ cardId: "ST21-014", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const drawn = e.findCardInZone("south", "deck", "ST21-005");
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST21-014"),
      e.findCardInZone("south", "character", "ST21-004"),
    );
    expect(e.getView("south").players.south.handCount).toBe(don === 2 ? 1 : 0);
    if (don === 2) expect(e.getView("south").players.south.hand[0]?.instanceId).toBe(drawn);
    expect(e.getView("south").players.south.restedDon).toBe(don);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST21-004");
  });
  test("effect KO also draws after DON returns to the cost area", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-004", attachedDon: 2 }], deck: ["ST21-005", "ST21-006"] },
      { hand: ["ST04-004"], activeDon: 6 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.playCard("ST04-004", "north");
    e.asNorth().acceptOptional();
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST21-004"));
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST21-005");
    expect(e.getView("south").players.south.restedDon).toBe(2);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
});
