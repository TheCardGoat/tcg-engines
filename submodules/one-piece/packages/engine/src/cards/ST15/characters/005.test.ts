import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("ST15-005", () => {
  test("is present on the field", () => {
    const engine = OnePieceTestEngine.create({ character: ["ST15-005"], activeDon: 5 }, {});
    const cardId = engine.findCardInZone("south", "character", "ST15-005");
    expect(cardId).toBeDefined();
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      cardId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("attacks the opposing Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "ST15-005", attachedDon: 2 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.asSouth().attack("ST15-005", engine.asNorth().leader());

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
