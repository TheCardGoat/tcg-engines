import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Mr1DazBonez063, op02Smoker093 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-093 Smoker", () => {
  test("creates the cost-0 boundary, gains 1000 power, and expires turn modifiers", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op02Smoker093, activeDon: 1 },
      { character: [op02Mr1DazBonez063, eb01Doma005] },
    );
    const boundaryId = engine.findCardInZone("north", "character", op02Mr1DazBonez063);
    const otherId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected Smoker's controller to choose an opposing Character.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([boundaryId, otherId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === boundaryId)?.cost,
    ).toBe(0);
    expect(view.players.north.characters.find((card) => card?.instanceId === otherId)?.cost).toBe(
      1,
    );
    expect(view.players.south.leader.power).toBe(7000);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === boundaryId)?.cost,
    ).toBe(1);
    expect(view.players.south.leader.power).toBe(5000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
