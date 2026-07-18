import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op10Issho023, op11XCalibur020 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-020 X Calibur", () => {
  test("Main gives up to two opposing Characters −2000 before an included Navy Character +1000", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11XCalibur020],
        character: [op10Issho023],
        activeDon: 2,
      },
      { character: [eb01MountainGod018, eb01Doma005] },
    );
    const navyId = engine.findCardInZone("south", "character", op10Issho023);
    const highId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lowId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op11XCalibur020);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [highId, lowId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [navyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === highId)?.power).toBe(
      5000,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === lowId)?.power).toBe(
      1000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === navyId)?.power).toBe(
      7000,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger K.O.s the power-4000 boundary without activating Main", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [op11XCalibur020] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const decision = engine.pendingDecision("effectTargetSelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a power-4000 K.O. choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
