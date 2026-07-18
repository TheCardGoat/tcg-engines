import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01KinEmon040,
  op01Sanji013,
  op03DeathlyPoisonGasBombMh5038,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-038 Deathly Poison Gas Bomb MH5", () => {
  test("maps up to 2 opposing Characters at the cost-2 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03DeathlyPoisonGasBombMh5038],
        activeDon: 1,
      },
      {
        character: [eb01Doma005, op01Sanji013, eb01Fourtricks025],
      },
    );
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondId = engine.findCardInZone("north", "character", op01Sanji013);
    const excludedId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op03DeathlyPoisonGasBombMh5038);

    const restDecision = engine.pendingDecision("effectTargetSelection", "south");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose up to two low-cost Characters.");
    }
    expect(restStep).toMatchObject({ min: 0, max: 2 });
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toEqual([firstId, secondId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === firstId)?.rested).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === secondId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === excludedId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger rests an opposing Character at the cost-5 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01KinEmon040, playedOnTurn: 0 },
        ],
      },
      {
        life: [op03DeathlyPoisonGasBombMh5038],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const boundaryId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("south", "character", op01KinEmon040);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const restDecision = engine.pendingDecision("effectTargetSelection", "north");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing Character to rest.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toContain(boundaryId);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === boundaryId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === excludedId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
