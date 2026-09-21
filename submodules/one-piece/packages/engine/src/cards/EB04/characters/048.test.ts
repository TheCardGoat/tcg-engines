import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-048", () => {
  test("plays for 4 DON!! and deals damage to the opposing Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-048", attachedDon: 2 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.asSouth().attack("EB04-048", engine.asNorth().leader());

    const card = engine
      .getView("south")
      .players.south.characters.find((c) => c?.cardId === "EB04-048");
    expect(card).toBeDefined();
    expect(card?.power).toBe(8000);
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
