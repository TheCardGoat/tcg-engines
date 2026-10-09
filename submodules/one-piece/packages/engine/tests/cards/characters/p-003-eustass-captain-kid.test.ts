import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P003 Kid", () => {
  test.each([1, 2])("DON%s deals corresponding one or two Life damage", (don) => {
    const e = OnePieceTestEngine.create(
      { character: ["P-003"], activeDon: don },
      { life: ["ST02-002", "ST02-006", "ST02-012"] },
    );
    const id = e.findCardInZone("south", "character", "P-003");
    e.asSouth().attachDon(id, don);
    e.asSouth().attack(id, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3 - (don === 2 ? 2 : 1));
    expect(e.getView("north").players.north.handCount).toBe(don === 2 ? 2 : 1);
  });
  test("DON attached to another card cannot grant Double Attack", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-003", attachedDon: 1 }], activeDon: 2 },
      { life: 3 },
    );
    e.asSouth().attachDon(e.leader("south"), 2);
    e.asSouth().attack(e.findCardInZone("south", "character", "P-003"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
});
