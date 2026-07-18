import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03RobLucci092,
  op04DragonTwisterDemolitionBreath057,
  op04Olin099,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP04-057 Dragon Twister Demolition Breath", () => {
  test("Counter maps power before either-field cost-1 bottom-decking with owner routing", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        hand: [op04DragonTwisterDemolitionBreath057],
        character: [eb01Doma005],
        activeDon: 2,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingId = engine.findCardInZone("south", "character", eb01Doma005);
    const ownId = engine.findCardInZone("north", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op04DragonTwisterDemolitionBreath057);
    const ownDeckBefore = engine.getView("north").players.north.deckCount;
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose a cost-1 Character from either field.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.characters.some((card) => card?.instanceId === ownId)).toBe(false);
    expect(view.players.north.deckCount).toBe(ownDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps either field at the effective cost-6 hand-return boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op04Olin099, playedOnTurn: 0 },
          { card: op03RobLucci092, playedOnTurn: 0 },
        ],
      },
      {
        character: [eb01Doma005],
        life: [op04DragonTwisterDemolitionBreath057],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op04Olin099);
    const opposingId = engine.findCardInZone("south", "character", op03RobLucci092);
    const ownId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error(
        "Expected the damaged player to choose a low-cost Character from either field.",
      );
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "north");

    const ownerView = engine.getView("south");
    expect(ownerView.players.south.hand.map((card) => card.instanceId)).toContain(opposingId);
    expect(ownerView.players.south.characters.some((card) => card?.instanceId === opposingId)).toBe(
      false,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
