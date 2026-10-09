import "../../../cards/src/index.ts";
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";

describe("6-2 Refresh and overlapping DON!! restrictions", () => {
  test.each([
    { second: 0, frozen: 1, label: "same DON!!" },
    { second: 1, frozen: 2, label: "distinct DON!!" },
  ])("two Bonney effects on $label freeze only their selected cards", ({ second, frozen }) => {
    let engine = OnePieceTestEngine.create(
      { hand: ["OP07-026", "OP07-026"], activeDon: 10, deck: ["ST01-003", "ST01-004"] },
      { restedDon: 2, donDeckCount: 0, deck: ["ST01-003", "ST01-004", "ST01-003"] },
    );
    for (let index = 0; index < 2; index++) {
      engine.asSouth().play("OP07-026");
      const step = engine.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected Bonney's freeze selection");
      expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([
        "rested-don:north:0",
        "rested-don:north:1",
      ]);
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [`rested-don:north:${index === 0 ? 0 : second}`] },
        "south",
      );
    }
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.asSouth().endTurn();
    expect(engine.getView("north").players.north).toMatchObject({
      activeDon: 2 - frozen,
      restedDon: frozen,
    });
    engine.asNorth().endTurn();
    engine.asSouth().endTurn();
    expect(engine.getView("north").players.north).toMatchObject({ activeDon: 2, restedDon: 0 });
  });
});
