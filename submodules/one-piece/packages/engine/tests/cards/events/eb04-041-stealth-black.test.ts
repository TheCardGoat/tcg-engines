import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02Sanji054,
  op02Sanji026,
  op04Sanji104,
  op09Sanji065,
  op14eb04StealthBlack041,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("EB04-041 Stealth Black", () => {
  test("at the four-DON!! boundary, maps eligible Sanji plays from hand or trash", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02Sanji026,
      hand: [op14eb04StealthBlack041, eb02Sanji054, op09Sanji065],
      trash: [op04Sanji104, eb01Doma005],
      activeDon: 4,
    });
    const eventId = engine.findCardInZone("south", "hand", op14eb04StealthBlack041);
    const handSanjiId = engine.findCardInZone("south", "hand", eb02Sanji054);
    const tooPowerfulId = engine.findCardInZone("south", "hand", op09Sanji065);
    const selectedTrashSanjiId = engine.findCardInZone("south", "trash", op04Sanji104);
    const unrelatedId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.playCard(op14eb04StealthBlack041);

    const playDecision = engine.pendingDecision("effectPlaySelection", "south");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the Sanji controller to receive the hand-or-trash play choice.");
    }
    expect(playStep).toMatchObject({ min: 0, max: 1 });
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      handSanjiId,
      selectedTrashSanjiId,
    ]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedTrashSanjiId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.some((card) => card?.instanceId === selectedTrashSanjiId),
    ).toBe(true);
    expect(view.players.south.hand.some((card) => card.instanceId === handSanjiId)).toBe(true);
    expect(view.players.south.hand.some((card) => card.instanceId === tooPowerfulId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, unrelatedId]),
    );
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 3 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("draws 2 from Life Trigger, then lets the damaged player choose the discard", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        deck: [eb01Doma005, eb01Fourtricks025, eb02Sanji054, op04Sanji104],
        life: [op14eb04StealthBlack041],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedDiscardId = engine.findCardInZone("north", "deck", eb01Doma005);
    const keptCardId = engine.findCardInZone("north", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const discardDecision = engine.pendingDecision("effectTrashFromHandSelection", "north");
    const discardStep = discardDecision.steps[0];
    expect(discardStep?.kind).toBe("selectEntity");
    if (discardStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to receive the post-draw discard choice.");
    }
    expect(discardStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedDiscardId,
      keptCardId,
    ]);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [selectedDiscardId] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual([keptCardId]);
    expect(view.players.north.trash.map((card) => card.cardId)).toEqual(
      expect.arrayContaining([op14eb04StealthBlack041.id, eb01Doma005.id]),
    );
    expect(view.players.north.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
