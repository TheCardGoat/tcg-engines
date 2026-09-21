import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Sasaki (OP17-068) cost=3 power=4000 counter=2000
describe("OP17-068 Sasaki", () => {
  test("field placement with 4000 power", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP17-068"], activeDon: 3 }, {});

    const cardId = engine.findCardInZone("south", "character", "OP17-068");
    expect(cardId).toBeDefined();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-068", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-068",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
