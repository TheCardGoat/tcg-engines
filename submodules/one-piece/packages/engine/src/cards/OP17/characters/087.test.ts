import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-087", () => {
  test("[On Play] with a cost-12+ Character on the field gives an opposing Character -3000 power for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-087"], character: ["OP17-085"], activeDon: 5 },
      { character: ["OP01-018"], activeDon: 5 },
    );
    const hajrudinId = engine.findCardInZone("north", "character", "OP01-018");
    const hajrudin = () =>
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === hajrudinId);
    expect(hajrudin()?.power).toBe(6000);

    engine.playCard("OP17-087");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hajrudinId] }, "south");

    expect(hajrudin()?.power).toBe(3000);
    // The continuous +3000 also applies while Dorry (cost 5 +12) is on the field.
    const robin = engine
      .getView("south")
      .players.south.characters.find((c) => c?.cardId === "OP17-087");
    expect(robin?.power).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.endTurn("south");
    expect(hajrudin()?.power).toBe(6000);
  });

  test("[On Play] without a cost-12+ Character does nothing", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-087"], activeDon: 5 },
      { character: ["OP01-018"], activeDon: 5 },
    );
    const hajrudinId = engine.findCardInZone("north", "character", "OP01-018");

    engine.playCard("OP17-087");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === hajrudinId)
        ?.power,
    ).toBe(6000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-087", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-087",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
