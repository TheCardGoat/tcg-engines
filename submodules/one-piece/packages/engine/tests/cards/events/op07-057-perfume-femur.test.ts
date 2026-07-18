import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op05BartholomewKuma011,
  op07BoaHancock038,
  op07PerfumeFemur057,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-057 Perfume Femur", () => {
  test("Main selects an included Seven Warlords attacker and prevents the opponent from blocking it", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07BoaHancock038,
        hand: [op07PerfumeFemur057],
        character: [
          { card: op05BartholomewKuma011, attachedDon: 1, playedOnTurn: 0 },
          eb01Fourtricks025,
        ],
        activeDon: 2,
      },
      {
        character: [eb01TonyTonyChopper006],
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op05BartholomewKuma011);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const blockerId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    const powerBefore = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === attackerId)?.power;

    engine.playCard(op07PerfumeFemur057);

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Perfume Femur to publish its Warlords selection.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      attackerId,
    ]);
    expect(targetStep.candidates.some((candidate) => candidate.ref.id === unrelatedId)).toBe(false);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === attackerId)?.power,
    ).toBe(powerBefore! + 2000);
    engine.declareAttack(attackerId, engine.leader("north"), "south");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one card without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op07PerfumeFemur057],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
