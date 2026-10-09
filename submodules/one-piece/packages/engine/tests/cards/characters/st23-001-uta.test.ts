import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st23-001-uta", () => {
  test("current-power threshold discounts actual play and preserves field cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST23-001"], character: [{ cardId: "ST21-008", attachedDon: 4 }], activeDon: 2 },
      {},
    );
    e.playCard("ST23-001");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(6);
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST23-001"));
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST23-001");
  });
  test("a powerful Leader alone does not reduce Uta's cost", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST23-001"], activeDon: 7 });
    e.asSouth().attachDon(e.leader("south"), 5);
    expect(
      e.expectFailure({
        type: "playCard",
        seat: "south",
        instanceId: e.findCardInZone("south", "hand", "ST23-001"),
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("declines optional Blocker interception", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST23-001"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
