import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op02ArabesqueBrickFist067,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-067 Arabesque Brick Fist", () => {
  test("maps either field and returns the chosen own cost-4 Character to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02ArabesqueBrickFist067],
        character: [op01Hajrudin018],
        activeDon: 2,
      },
      {
        character: [eb01Fourtricks025, eb01MountainGod018],
      },
    );
    const ownId = engine.findCardInZone("south", "character", op01Hajrudin018);
    const opposingId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op02ArabesqueBrickFist067);

    const returnDecision = engine.pendingDecision("effectTargetSelection", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose a Character from either field.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      tooExpensiveId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(ownId);
    expect(view.players.north.characters.some((card) => card?.instanceId === opposingId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main without payment and returns an opposing Character to its owner", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      {
        character: [op01Hajrudin018],
        life: [op02ArabesqueBrickFist067],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const ownId = engine.findCardInZone("north", "character", op01Hajrudin018);
    const activeDonBefore = engine.getView("north").players.north.activeDon;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose a Character from either field.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "north");

    const view = engine.getView("north");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      opposingId,
    );
    expect(view.players.north.activeDon).toBe(activeDonBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
