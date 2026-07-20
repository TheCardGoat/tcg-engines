import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04CorridaColiseum096 } from "@tcg/op-cards";
import { op13Franky033 } from "../../../../../cards/src/cards/OP13/characters/033-franky.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-033 Franky", () => {
  test("on battle K.O. rests two selected active opposing cards from the combined field and DON!! zones", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Franky033, rested: true, playedOnTurn: 0 }, eb01Doma005],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
        stage: op04CorridaColiseum096,
        activeDon: 1,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const frankyId = engine.findCardInZone("south", "character", op13Franky033);
    const friendlyId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const opposingCharacterId = engine.findCardInZone("north", "character", eb01Doma005);
    const opposingStageId = engine.findCardInZone("north", "stage", op04CorridaColiseum096);

    engine.declareAttack(attackerId, frankyId, "north");

    const decision = engine.pendingDecision("effectMixedRestSelection", "south");
    expect(decision.actorId).toBe("south");
    const targets = decision.steps[0];
    if (targets?.kind !== "payCost") throw new Error("Expected Franky's mixed rest targets.");
    expect(targets).toMatchObject({ min: 0, max: 2 });
    const candidateIds = targets.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toEqual(
      expect.arrayContaining([engine.leader("north"), opposingCharacterId, opposingStageId]),
    );
    expect(candidateIds).not.toContain(attackerId);
    expect(candidateIds).not.toContain(friendlyId);
    const donId = candidateIds.find((id) => id.startsWith("active-don:north:"));
    if (!donId) throw new Error("Expected an opposing active DON!! candidate.");

    engine.resolveDecision(
      "effectMixedRestSelection",
      { selectedIds: [opposingStageId, donId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(frankyId);
    expect(view.players.north.stage?.rested).toBe(true);
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingCharacterId)
        ?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may rest zero opposing cards after being K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op13Franky033, rested: true, playedOnTurn: 0 }] },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const frankyId = engine.findCardInZone("south", "character", op13Franky033);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const untouchedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, frankyId, "north");
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(frankyId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === untouchedId)?.rested,
    ).toBe(false);
    expect(view.players.north.leader.rested).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
