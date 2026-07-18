import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op03Alvida023,
  op03Kuro021,
  op03OutOfTheBag036,
  op04Kuro023,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-036 Out-of-the-Bag", () => {
  test("rests a compound East Blue Character and maps the Kuro-card reactivation choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Kuro021,
        hand: [op03OutOfTheBag036],
        character: [op03Alvida023, { card: op04Kuro023, rested: true }],
        activeDon: 3,
      },
      {
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const costId = engine.findCardInZone("south", "character", op03Alvida023);
    const kuroCharacterId = engine.findCardInZone("south", "character", op04Kuro023);
    const leaderId = engine.leader("south");

    engine.declareAttack(leaderId, engine.leader("north"), "south");
    engine.playCard(op03OutOfTheBag036);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose a rested Kuro card to reactivate.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      leaderId,
      kuroCharacterId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(false);
    expect(view.players.south.characters.find((card) => card?.instanceId === costId)?.rested).toBe(
      true,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kuroCharacterId)?.rested,
    ).toBe(true);
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
        life: [op03OutOfTheBag036],
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
