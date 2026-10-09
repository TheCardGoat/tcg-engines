import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-065-tony-tony-chopper", () => {
  test.each([true, false])(
    "current-cost-zero condition=%s persists only until next own start",
    (reduce) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: ["P-065"], hand: ["ST06-008"], activeDon: 3 },
        { leaderCardId: "ST01-001", character: ["ST02-002"] },
      );
      if (reduce) {
        e.asSouth().play("ST06-008");
        e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST02-002"));
      }
      e.asSouth().attack(e.findCardInZone("south", "character", "P-065"), e.leader("north"));
      expect(e.getView("south").players.south.characters[0]?.power).toBe(reduce ? 6000 : 4000);
      e.asSouth().endTurn();
      expect(e.getView("south").players.south.characters[0]?.power).toBe(reduce ? 6000 : 4000);
      e.asNorth().endTurn();
      expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
    },
  );
  test("own Characters alone do not satisfy opponent condition", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["P-065", "OP06-106"] },
      { leaderCardId: "ST01-001" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "P-065"), e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
    expect(e.getView("north").players.north.lifeCount).toBe(5);
  });
});
