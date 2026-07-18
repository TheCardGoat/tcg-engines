import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01Sanji014,
  eb02Enel052,
  op01CrescentCutlass089,
  op01DonquixoteDoflamingo060,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP01-089 Crescent Cutlass", () => {
  test("with a Seven Warlords Leader, maps either field and returns the chosen cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
      },
      {
        leaderCardId: op01DonquixoteDoflamingo060,
        hand: [op01CrescentCutlass089],
        character: [eb01Sanji014, eb02Enel052],
        activeDon: 3,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingId = engine.findCardInZone("south", "character", eb01Doma005);
    const selectedOwnId = engine.findCardInZone("north", "character", eb01Sanji014);
    const excludedOwnId = engine.findCardInZone("north", "character", eb02Enel052);
    const eventId = engine.findCardInZone("north", "hand", op01CrescentCutlass089);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose a cost-5-or-less Character to return.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedOwnId,
      attackerId,
      opposingId,
    ]);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedOwnId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedOwnId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(selectedOwnId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("still pays for the Counter Event when the Leader trait condition is not met", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op01CrescentCutlass089],
        character: [eb01Sanji014],
        activeDon: 3,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const unchangedId = engine.findCardInZone("north", "character", eb01Sanji014);
    const eventId = engine.findCardInZone("north", "hand", op01CrescentCutlass089);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === unchangedId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
