import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Rockstar (OP17-034) cost=5 power=6000 counter=1000
describe("OP17-034 Rockstar", () => {
  test("field placement with 6000 power", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP17-034"], activeDon: 5 }, {});

    const cardId = engine.findCardInZone("south", "character", "OP17-034");
    expect(cardId).toBeDefined();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-034", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-034",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
