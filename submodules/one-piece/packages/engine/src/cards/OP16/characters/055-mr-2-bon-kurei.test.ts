import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-055 Mr.2 Bon.Kurei", () => {
  test("[On Play] draws 1 card", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-055", "EB01-005"], activeDon: 2 }, {});

    engine.playCard("OP16-055");

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
  });

  test("[DON!! x1] [When Attacking] base power becomes the opposing Leader's power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-055", attachedDon: 1 }], activeDon: 5 },
      {},
    );
    const leaderPower = engine.getView("south").players.north.leader?.power ?? 0;

    engine.asSouth().attack("OP16-055", engine.asNorth().leader());

    const power = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === "OP16-055")?.power;
    // Set base power plus the attached DON!! bonus.
    expect(power).toBe(leaderPower + 1000);
  });

  test("without an attached DON!! the When Attacking bonus does not apply", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP16-055"], activeDon: 5 }, {});

    engine.asSouth().attack("OP16-055", engine.asNorth().leader());

    const power = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === "OP16-055")?.power;
    expect(power).toBe(1000);
  });
});
