import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op01Hajrudin018,
  op02IceAge117,
  op03CrossFire017,
  op03FireFist018,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-018 Fire Fist", () => {
  test("trashes a chosen Event, then maps the ordered power-5000 and power-4000 K.O.s", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03FireFist018, op03CrossFire017, op02IceAge117, eb01Doma005],
        activeDon: 3,
      },
      {
        character: [eb01Fourtricks025, eb01Doma005, op01Hajrudin018],
      },
    );
    const selectedCostId = engine.findCardInZone("south", "hand", op03CrossFire017);
    const keptEventId = engine.findCardInZone("south", "hand", op02IceAge117);
    const nonEventId = engine.findCardInZone("south", "hand", eb01Doma005);
    const firstKoId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const secondKoId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", op01Hajrudin018);

    engine.playCard(op03FireFist018);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the controller to choose an Event hand payment.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedCostId,
      keptEventId,
    ]);
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonEventId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [selectedCostId] }, "south");

    const firstDecision = engine.pendingDecision("effectTargetSelection", "south");
    const firstStep = firstDecision.steps[0];
    expect(firstStep?.kind).toBe("selectEntity");
    if (firstStep?.kind !== "selectEntity") {
      throw new Error("Expected the first opposing Character K.O. choice.");
    }
    expect(firstStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstKoId,
      secondKoId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstKoId] }, "south");

    const secondDecision = engine.pendingDecision("effectTargetSelection", "south");
    const secondStep = secondDecision.steps[0];
    expect(secondStep?.kind).toBe("selectEntity");
    if (secondStep?.kind !== "selectEntity") {
      throw new Error("Expected the second lower-power Character K.O. choice.");
    }
    expect(secondStep.candidates.map((candidate) => candidate.ref.id)).toEqual([secondKoId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [secondKoId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstKoId, secondKoId]),
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([keptEventId, nonEventId]),
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(selectedCostId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger K.O.s only an opposing Character at the power-5000 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op01Hajrudin018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      {
        life: [op03FireFist018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op01Hajrudin018);
    const boundaryId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([boundaryId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(boundaryId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
