import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01Urashima092,
  op03Carne045,
  op03Genzo046,
  op03Kuro021,
  op03Usopp041,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-021 Kuro", () => {
  test("rests two included East Blue Characters to reactivate and rest the cost-5 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Kuro021,
        character: [op03Genzo046, op03Carne045, op03Usopp041, eb01Doma005],
        activeDon: 3,
      },
      { character: [eb01Doma005, { card: op01Urashima092, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const genzoId = engine.findCardInZone("south", "character", op03Genzo046);
    const carneId = engine.findCardInZone("south", "character", op03Carne045);
    const usoppId = engine.findCardInZone("south", "character", op03Usopp041);
    const excludedCostId = engine.findCardInZone("south", "character", eb01Doma005);
    const restTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const attackTargetId = engine.findCardInZone("north", "character", op01Urashima092);

    engine.declareAttack(engine.leader("south"), attackTargetId, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostRestCards", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected Kuro's controller to choose two East Blue Characters.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      genzoId,
      carneId,
      usoppId,
    ]);
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedCostId);
    engine.resolveDecision("effectCostRestCards", { selectedIds: [genzoId, carneId] }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Kuro's controller to choose a low-cost opposing Character.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([restTargetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restTargetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(false);
    expect(view.players.south.characters.find((card) => card?.instanceId === genzoId)?.rested).toBe(
      true,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === carneId)?.rested).toBe(
      true,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === usoppId)?.rested).toBe(
      false,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === restTargetId)?.rested,
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
