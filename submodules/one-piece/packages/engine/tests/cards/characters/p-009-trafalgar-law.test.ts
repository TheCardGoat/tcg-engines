import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P009 Law", () => {
  test.each([5, 6])(
    "opponent hand%s gate moves only opposing top Life to hand without Trigger",
    (hand) => {
      const e = OnePieceTestEngine.create(
        { hand: ["P-009"], activeDon: 6, life: 3 },
        { hand, life: ["ST29-012", "ST02-002"] },
      );
      const top = e.findCardInZone("north", "life", "ST29-012");
      e.asSouth().play("P-009");
      expect(e.getView("north").players.north.lifeCount).toBe(hand === 6 ? 1 : 2);
      expect(e.getView("north").players.north.handCount).toBe(hand === 6 ? 7 : 5);
      expect(e.getView("north").players.north.hand.some((c) => c.instanceId === top)).toBe(
        hand === 6,
      );
      expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
      expect(e.getView("south").players.south.lifeCount).toBe(3);
      expect(e.getView("north").prompts).toHaveLength(0);
    },
  );
  test("zero opposing Life does not cause damage defeat", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-009"], activeDon: 6 }, { hand: 6, life: 0 });
    e.asSouth().play("P-009");
    expect(e.getView("north").status).toBe("active");
    expect(e.getView("north").players.north.handCount).toBe(6);
  });
});
