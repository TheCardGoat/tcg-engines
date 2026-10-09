import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st24-001-capone-gang-bege", () => {
  test.each([3, 4])("play payment counts toward six rested cards with prior DON=%s", (rested) => {
    const e = OnePieceTestEngine.create({
      hand: ["ST24-001", "ST21-013"],
      activeDon: 2,
      restedDon: rested,
      deck: ["ST21-005", "ST21-006"],
    });
    e.playCard("ST24-001");
    if (rested === 4) {
      expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("ST21-005");
      e.resolveDecision(
        "effectTrashFromHandSelection",
        { selectedIds: [e.findCardInZone("south", "hand", "ST21-005")] },
        "south",
      );
    }
    expect(e.getView("south").players.south.deckCount).toBe(rested === 4 ? 1 : 2);
    expect(e.getView("south").players.south.restedDon).toBe(rested + 2);
  });
  test("a rested Leader supplies the sixth card and Blocker protects it", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST24-001", "ST21-013"],
        activeDon: 2,
        restedDon: 3,
        deck: ["ST21-005", "ST21-006"],
      },
      {},
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.playCard("ST24-001");
    e.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [e.findCardInZone("south", "hand", "ST21-005")] },
      "south",
    );
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST24-001"));
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST24-001");
  });
  test("declines optional Blocker interception", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST24-001"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
