import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST22-003 Newgate", () => {
  test.each(["OP01-033", "ST02-002"])(
    "revealed %s controls draw and stays top unless drawn",
    (top) => {
      const e = OnePieceTestEngine.create({
        hand: ["ST22-003"],
        activeDon: 9,
        deck: [top, "ST02-006", "ST02-012"],
      });
      const id = e.findCardInZone("south", "deck", top);
      e.asSouth().play("ST22-003");
      expect(e.getView("south").players.south.handCount).toBe(top === "OP01-033" ? 2 : 0);
      if (top === "OP01-033")
        expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(id);
      else expect(e.getView("judge").players.south.deckTop?.instanceId).toBe(id);
    },
  );
  test("Double Attack deals two Life damage", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST22-003", playedOnTurn: 0 }] },
      { life: ["ST01-006", "ST01-006", "ST01-006"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST22-003"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(1);
    expect(e.getView("north").players.north.handCount).toBe(2);
  });
  test("matching last deck card cannot evade deck-out defeat", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST22-003"], activeDon: 9, deck: ["OP01-033"] });
    e.asSouth().play("ST22-003");
    expect(e.getView("south").status).toBe("finished");
    expect(e.getView("south").players.south.deckCount).toBe(0);
  });
});
