import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-009 Speed Jil", () => {
  test("[On Play] trashing an 8000-power Character grants [Rush] and +2000 power", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-009", "OP16-004"], activeDon: 4 }, {});

    engine.playCard("OP16-009");
    engine.acceptLeadingOptional("south");

    const jilId = engine.findCardInZone("south", "character", "OP16-009");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === jilId)?.power,
    ).toBe(7000);

    // [Rush]: the freshly played Character may attack this turn.
    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.asSouth().attack("OP16-009", engine.asNorth().leader());
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("declining leaves no Rush and no power bonus", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-009", "OP16-004"], activeDon: 4 }, {});

    engine.playCard("OP16-009");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const jilId = engine.findCardInZone("south", "character", "OP16-009");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === jilId)?.power,
    ).toBe(5000);
    expect(() => engine.asSouth().attack("OP16-009", engine.asNorth().leader())).toThrow();
  });
});
