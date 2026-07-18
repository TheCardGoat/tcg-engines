import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  op01EustassCaptainKid051,
  op01King096,
  op02DeathWink069,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-069 DEATH WINK", () => {
  test("Counter power draws only enough cards to bring the post-activation hand to 2", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op02DeathWink069, eb01Doma005],
        deck: [eb01Fourtricks025, eb01Sanji014],
        activeDon: 3,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op02DeathWink069);
    const keptId = engine.findCardInZone("north", "hand", eb01Doma005);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Fourtricks025);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual([keptId, firstDrawId]);
    expect(view.players.north.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not draw or discard when the post-activation hand already has 2 cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op02DeathWink069, eb01Doma005, eb01Fourtricks025],
        deck: [eb01Sanji014],
        activeDon: 3,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op02DeathWink069);
    const firstKeptId = engine.findCardInZone("north", "hand", eb01Doma005);
    const secondKeptId = engine.findCardInZone("north", "hand", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual([
      firstKeptId,
      secondKeptId,
    ]);
    expect(view.players.north.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps either field and returns the chosen own cost-7 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        character: [op01King096, op01EustassCaptainKid051],
        life: [op02DeathWink069],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const boundaryId = engine.findCardInZone("north", "character", op01King096);
    const tooExpensiveId = engine.findCardInZone("north", "character", op01EustassCaptainKid051);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose a Character from either field.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toContain(boundaryId);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toContain(attackerId);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      tooExpensiveId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(boundaryId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
