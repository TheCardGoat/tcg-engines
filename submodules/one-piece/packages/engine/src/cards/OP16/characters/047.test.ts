import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-047", () => {
  test("is present on the field", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP16-047"], activeDon: 5 }, {});
    const cardId = engine.findCardInZone("south", "character", "OP16-047");
    expect(cardId).toBeDefined();
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-047", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-047",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
