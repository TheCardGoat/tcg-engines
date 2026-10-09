import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("P-107", () => {
  test("[On Play] at 10 field DON!! boosts the Leader until the opponent's next End Phase", () => {
    // A 6000-power Leader would block the unboosted 5000-power Leader.
    const engine = OnePieceTestEngine.create(
      { hand: ["P-107"], activeDon: 10 },
      { leaderCardId: "OP02-001", activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard("P-107");
    expect(engine.getView("south").players.south.leader.power).toBe(7000);

    // The boosted Leader breaks through the opposing 6000-power Leader.
    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });

  test.each([9, 10])("opponent-only DON threshold %s controls the Leader bonus", (opponentDon) => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-107"], activeDon: 8 },
      { activeDon: opponentDon },
    );
    e.playCard("P-107");
    expect(e.getView("south").players.south.leader.power).toBe(opponentDon === 10 ? 7000 : 5000);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
    e.endTurn("south");
    expect(e.getView("south").players.south.leader.power).toBe(opponentDon === 10 ? 7000 : 5000);
    e.endTurn("north");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
});
