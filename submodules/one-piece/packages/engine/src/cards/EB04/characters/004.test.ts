import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-004", () => {
  test("[When Attacking] raises the Leader's base power to 7000 through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-004", attachedDon: 2 }], activeDon: 5 },
      { character: ["EB04-048"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    // The When Attacking trigger sets the Leader base to 7000.
    engine.asSouth().attack("EB04-004", engine.asNorth().leader());
    engine.endTurn("south");
    engine.asNorth().attack("EB04-048", engine.asSouth().leader());

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without the trigger the 5000 Leader takes damage from a 6000 attacker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP13-013", attachedDon: 2 }], activeDon: 5 },
      { character: ["EB04-048"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.asSouth().attack("OP13-013", engine.asNorth().leader());
    engine.endTurn("south");
    engine.asNorth().attack("EB04-048", engine.asSouth().leader());

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
  });
});
