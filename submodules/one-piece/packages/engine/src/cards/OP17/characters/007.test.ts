import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Kouzuki Oden (OP17-007) cost=7 power=8000 counter=0
describe("OP17-007 Kouzuki Oden", () => {
  test("field placement with 8000 power", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP17-007"], activeDon: 7 }, {});

    const cardId = engine.findCardInZone("south", "character", "OP17-007");
    expect(cardId).toBeDefined();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-007", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-007",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
