import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("P-107", () => {
  test("[On Play] at 10 field DON!! boosts the Leader until the opponent's next End Phase", () => {
    // A 6000-power Leader would wall the 5000 Roger without the boost.
    const engine = OnePieceTestEngine.create(
      { hand: ["P-107"], activeDon: 10 },
      { leaderCardId: "OP11-040", activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard("P-107");
    expect(engine.getView("south").players.south.leader.power).toBe(7000);

    // Boosted to 7000, Roger breaks through the 6000 Leader.
    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("is present on the field", () => {
    const engine = OnePieceTestEngine.create({ character: ["P-107"], activeDon: 5 }, {});
    const cardId = engine.findCardInZone("south", "character", "P-107");
    expect(cardId).toBeDefined();
  });
});
