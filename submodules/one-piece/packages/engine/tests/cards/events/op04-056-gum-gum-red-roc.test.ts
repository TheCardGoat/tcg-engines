import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Hajrudin018,
  op04GumGumRedRoc056,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP04-056 Gum-Gum Red Roc", () => {
  test("Main maps either field and bottom-decks the chosen own Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04GumGumRedRoc056],
        character: [eb01MountainGod018],
        activeDon: 6,
      },
      {
        character: [op01Hajrudin018],
      },
    );
    const ownId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingId = engine.findCardInZone("north", "character", op01Hajrudin018);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op04GumGumRedRoc056);

    const returnDecision = engine.pendingDecision("effectTargetSelection", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose a Character from either field.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === ownId)).toBe(false);
    expect(view.players.south.deckCount).toBe(deckBefore + 1);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps either field at the effective cost-4 boundary with owner routing", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01Hajrudin018, playedOnTurn: 0 },
        ],
      },
      {
        character: [eb01Doma005],
        life: [op04GumGumRedRoc056],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingId = engine.findCardInZone("south", "character", op01Hajrudin018);
    const ownId = engine.findCardInZone("north", "character", eb01Doma005);
    const ownerDeckBefore = engine.getView("south").players.south.deckCount;

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
    expect(ownerView.players.south.characters.some((card) => card?.instanceId === opposingId)).toBe(
      false,
    );
    expect(ownerView.players.south.deckCount).toBe(ownerDeckBefore + 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
