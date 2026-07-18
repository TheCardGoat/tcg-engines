import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op02ParadiseTotsuka047,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-047 Paradise Totsuka", () => {
  test("rests an opposing Character at the cost-4 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02ParadiseTotsuka047],
        activeDon: 1,
      },
      {
        character: [op01Hajrudin018, eb01MountainGod018],
      },
    );
    const boundaryId = engine.findCardInZone("north", "character", op01Hajrudin018);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op02ParadiseTotsuka047);

    const restDecision = engine.pendingDecision("effectTargetSelection", "south");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose an opposing Character to rest.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toEqual([boundaryId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === boundaryId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === excludedId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger K.O.s only a rested opposing Character at the cost-3 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, rested: true, playedOnTurn: 0 },
          { card: op01Hajrudin018, rested: true, playedOnTurn: 0 },
        ],
      },
      {
        life: [op02ParadiseTotsuka047],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const boundaryId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const excludedId = engine.findCardInZone("south", "character", op01Hajrudin018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing rested Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([boundaryId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(boundaryId);
    expect(view.players.south.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
