import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-011 Blamenco", () => {
  test("[DON!! x2] [When Attacking] gives an opposing Character -4000 power for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-011", attachedDon: 2 }], activeDon: 5 },
      { character: ["OP01-018"], activeDon: 5 },
    );
    const hajrudinId = engine.findCardInZone("north", "character", "OP01-018");
    const hajrudin = () =>
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === hajrudinId);
    expect(hajrudin()?.power).toBe(6000);

    engine.asSouth().attack("OP17-011", engine.asNorth().leader());
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hajrudinId] }, "south");

    expect(hajrudin()?.power).toBe(2000);
    expect(engine.getView("south").prompts).toHaveLength(0);

    // The reduction lasts only during this turn.
    engine.endTurn("south");
    expect(hajrudin()?.power).toBe(6000);
  });

  test("one attached DON does not activate the attack power reduction", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-011", attachedDon: 1 }], activeDon: 5 },
      { character: ["OP01-018"] },
    );
    const target = engine.findCardInZone("north", "character", "OP01-018");
    engine.asSouth().attack("OP17-011", engine.asNorth().leader());
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === target)
        ?.power,
    ).toBe(6000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
