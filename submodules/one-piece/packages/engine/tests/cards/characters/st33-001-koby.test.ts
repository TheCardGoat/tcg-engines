import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST33-001 Koby", () => {
  test("optional discard precedes draw and Blocker intercepts", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST33-001", "ST02-002"],
      activeDon: 2,
      deck: ["ST02-006", "ST02-012"],
    });
    const paid = e.findCardInZone("south", "hand", "ST02-002");
    e.asSouth().play("ST33-001");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(paid);
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("ST02-006");
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST33-001"));
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST33-001");
  });
  test("declines optional discard with hand available", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST33-001", "ST02-002"], activeDon: 2, deck: 10 });
    e.asSouth().play("ST33-001");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
  test("declines optional Blocker", () => {
    const e = OnePieceTestEngine.create({}, { character: ["ST33-001"], life: 3 });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker();
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
});
