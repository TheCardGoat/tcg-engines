import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Hajrudin018,
  op04IceOni047,
  op04PlagueRounds055,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP04-055 Plague Rounds", () => {
  test("atomically maps the Ice Oni hand cost, either-field return cost, and trash play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04PlagueRounds055, op04IceOni047, op04IceOni047],
        trash: [op04IceOni047],
        character: [eb01Doma005],
        activeDon: 2,
      },
      {
        character: [op01Hajrudin018, eb01MountainGod018],
      },
    );
    const handCostIds = engine
      .getState()
      .players.south.hand.filter(
        (instanceId) => engine.getState().cards[instanceId]?.cardId === op04IceOni047.id,
      );
    const handCostId = handCostIds[1]!;
    const retainedHandId = handCostIds[0]!;
    const selectedPlayId = engine.findCardInZone("south", "trash", op04IceOni047);
    const ownCostId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingCostId = engine.findCardInZone("north", "character", op01Hajrudin018);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const opponentDeckBefore = engine.getView("north").players.north.deckCount;

    engine.playCard(op04PlagueRounds055);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const handCost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(handCost?.kind).toBe("payCost");
    if (handCost?.kind !== "payCost") {
      throw new Error("Expected the controller to choose which Ice Oni to trash.");
    }
    expect(handCost.candidates.map((candidate) => candidate.ref.id)).toEqual(handCostIds);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [handCostId] }, "south");

    const returnDecision = engine.pendingDecision("effectCostReturnCharacterToDeck", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("payCost");
    if (returnStep?.kind !== "payCost") {
      throw new Error("Expected the controller to choose either player's low-cost Character.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownCostId,
      opposingCostId,
    ]);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision(
      "effectCostReturnCharacterToDeck",
      { selectedIds: [opposingCostId] },
      "south",
    );

    const playDecision = engine.pendingDecision("effectPlaySelection", "south");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose which paid Ice Oni to play from trash.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedPlayId,
      handCostId,
    ]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedPlayId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === selectedPlayId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(handCostId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedHandId);
    expect(view.players.north.characters.some((card) => card?.instanceId === opposingCostId)).toBe(
      false,
    );
    expect(view.players.north.deckCount).toBe(opponentDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main without Event payment but retains both colon costs", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01Hajrudin018, playedOnTurn: 0 },
        ],
      },
      {
        hand: [op04IceOni047],
        trash: [op04IceOni047],
        character: [eb01Doma005],
        life: [op04PlagueRounds055],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingCostId = engine.findCardInZone("south", "character", op01Hajrudin018);
    const selectedPlayId = engine.findCardInZone("north", "trash", op04IceOni047);
    const activeDonBefore = engine.getView("north").players.north.activeDon;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision(
      "effectCostReturnCharacterToDeck",
      { selectedIds: [opposingCostId] },
      "north",
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedPlayId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === selectedPlayId)).toBe(
      true,
    );
    expect(view.players.north.hand).toHaveLength(0);
    expect(view.players.north.activeDon).toBe(activeDonBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
