import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st28-002-izo", () => {
  test("OnPlay grants Wano Leader Banish for this turn only", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST09-001", hand: ["ST28-002"], activeDon: 2 },
      { life: ["ST21-005", "ST21-006", "ST21-008"] },
    );
    e.playCard("ST28-002");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("ST21-005");
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("north").players.north.handCount).toBe(2);
  });
  test("wrong Leader receives no Banish", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST05-001", hand: ["ST28-002"], activeDon: 2 },
      { life: ["ST21-005", "ST21-006"] },
    );
    e.playCard("ST28-002");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.handCount).toBe(1);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
  test.each([1, 2])("Blocker needs two attached DON: %s", (don) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST28-002", attachedDon: don }] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    if (don === 2) e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST28-002"));
    expect(e.getView("south").players.south.lifeCount).toBe(don === 2 ? 4 : 3);
  });
  test("declines optional Blocker with two DON", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST28-002", attachedDon: 2 }] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
