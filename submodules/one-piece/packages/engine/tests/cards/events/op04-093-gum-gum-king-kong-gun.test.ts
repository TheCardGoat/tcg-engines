import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op04GumGumKingKongGun093,
  op04MonkeyDLuffy090,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP04-093 Gum-Gum King Kong Gun", () => {
  test("the played Event becomes the fifteenth trash card before granting Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04GumGumKingKongGun093],
        character: [{ card: op04MonkeyDLuffy090, playedOnTurn: 0 }],
        trash: 14,
        activeDon: 3,
      },
      {
        life: [eb01Doma005, eb01Fourtricks025],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const characterId = engine.findCardInZone("south", "character", op04MonkeyDLuffy090);
    const powerBefore = engine.getView("south").players.south.characters[0]?.power;
    if (powerBefore === undefined || powerBefore === null) {
      throw new Error("Expected the Dressrosa Character to expose its current power.");
    }

    engine.playCard(op04GumGumKingKongGun093);

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose their compound Dressrosa Character.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([characterId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(powerBefore + 6000);
    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(characterId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("below 15 trash after Event payment, grants power without Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04GumGumKingKongGun093],
        character: [{ card: op04MonkeyDLuffy090, playedOnTurn: 0 }],
        trash: 13,
        activeDon: 3,
      },
      {
        life: [eb01Doma005, eb01Fourtricks025],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const characterId = engine.findCardInZone("south", "character", op04MonkeyDLuffy090);
    const powerBefore = engine.getView("south").players.south.characters[0]?.power;
    if (powerBefore === undefined || powerBefore === null) {
      throw new Error("Expected the Dressrosa Character to expose its current power.");
    }

    engine.playCard(op04GumGumKingKongGun093);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(powerBefore + 6000);
    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(characterId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws 3 before giving its controller the mandatory two-card trash choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb01Doma005],
        life: [op04GumGumKingKongGun093],
        deck: [eb01Fourtricks025, op01Hajrudin018, eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const existingId = engine.findCardInZone("north", "hand", eb01Doma005);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Fourtricks025);
    const secondDrawId = engine.findCardInZone("north", "deck", op01Hajrudin018);
    const thirdDrawId = engine.findCardInZone("north", "deck", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const trashDecision = engine.pendingDecision("effectTrashFromHandSelection", "north");
    const trashStep = trashDecision.steps[0];
    expect(trashStep?.kind).toBe("selectEntity");
    if (trashStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose from their post-draw hand.");
    }
    expect(trashStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      existingId,
      firstDrawId,
      secondDrawId,
      thirdDrawId,
    ]);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawId, secondDrawId] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual([
      existingId,
      thirdDrawId,
    ]);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
