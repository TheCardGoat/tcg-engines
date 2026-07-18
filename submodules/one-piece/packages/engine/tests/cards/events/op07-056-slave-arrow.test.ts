import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Hack012,
  op07SlaveArrow056,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-056 Slave Arrow", () => {
  test("Counter returns a chosen cost-2-or-more Character before granting battle power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op07SlaveArrow056],
        character: [eb01Fourtricks025, op05Hack012],
        life: 2,
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op07SlaveArrow056);
    const costId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const secondEligibleId = engine.findCardInZone("north", "character", op05Hack012);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const costDecision = engine.pendingDecision("effectCostReturnCharacter", "north");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected Slave Arrow to publish its cost-2-or-more return candidates.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      costId,
      secondEligibleId,
    ]);
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [costId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      costId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws 2 before the controller chooses and orders 2 hand cards for deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op05Hack012],
        life: [op07SlaveArrow056],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const existingId = engine.findCardInZone("north", "hand", op05Hack012);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("north", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const bottomDecision = engine.pendingDecision("effectTargetSelection", "north");
    const bottomStep = bottomDecision.steps[0];
    expect(bottomStep?.kind).toBe("selectEntity");
    if (bottomStep?.kind !== "selectEntity") {
      throw new Error("Expected the post-draw two-card bottom-deck choice.");
    }
    expect(bottomStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      existingId,
      firstDrawId,
      secondDrawId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [secondDrawId, existingId] },
      "north",
    );

    expect(engine.getState().players.north.deck.slice(-2)).toEqual([secondDrawId, existingId]);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toEqual([
      firstDrawId,
    ]);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
