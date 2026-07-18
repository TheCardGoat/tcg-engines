import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Seaquake021,
  op03PortgasDAce001,
  op04Chinjao086,
  op04Gyats080,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-086 Chinjao", () => {
  test("after its own DON!!-enabled battle K.O., draws two before choosing two cards to trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04Chinjao086, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
        activeDon: 1,
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    expect(op04Chinjao086.traits).toEqual(["Dressrosa", "Happosui Army"]);
    const chinjaoId = engine.findCardInZone("south", "character", op04Chinjao086);
    const defeatedId = engine.findCardInZone("north", "character", eb01Doma005);
    const originalHandIds = [...engine.getState().players.south.hand];
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);

    engine.attachDon(chinjaoId, 1, "south");
    engine.declareAttack(chinjaoId, defeatedId, "south");

    const decision = engine.pendingDecision("effectTrashFromHandSelection", "south");
    expect(decision.actorId).toBe("south");
    const trash = decision.steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Chinjao's hand-trash choice.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([...originalHandIds, ...drawnIds]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: drawnIds }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(originalHandIds);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(drawnIds),
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(defeatedId);
    expect(view.players.south.deckCount).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === chinjaoId)?.attachedDon,
    ).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not trigger for another attacker's battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op04Chinjao086, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: 1,
      },
      { character: [{ card: op04Gyats080, playedOnTurn: 0, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("north", "character", op04Gyats080);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.attachDon(engine.findCardInZone("south", "character", op04Chinjao086), 1, "south");
    engine.declareAttack(attackerId, targetId, "south");

    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not trigger for an effect K.O. or without attached DON!!", () => {
    const effectKo = OnePieceTestEngine.create(
      {
        leaderCardId: op03PortgasDAce001,
        character: [op04Chinjao086],
        hand: [op02Seaquake021],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: 2,
      },
      { character: [op04Gyats080] },
    );
    const effectTargetId = effectKo.findCardInZone("north", "character", op04Gyats080);
    const effectDeckBefore = [...effectKo.getState().players.south.deck];
    effectKo.attachDon(effectKo.findCardInZone("south", "character", op04Chinjao086), 1, "south");
    effectKo.playCard(op02Seaquake021, "south");
    effectKo.resolveDecision("effectTargetSelection", { selectedIds: [effectTargetId] }, "south");
    expect(effectKo.getState().players.south.deck).toEqual(effectDeckBefore);
    expect(effectKo.getView("south").players.south.hand).toHaveLength(0);
    expect(effectKo.getView("south").prompts).toHaveLength(0);

    const noDon = OnePieceTestEngine.create(
      {
        character: [{ card: op04Chinjao086, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: op04Gyats080, playedOnTurn: 0, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chinjaoId = noDon.findCardInZone("south", "character", op04Chinjao086);
    const battleTargetId = noDon.findCardInZone("north", "character", op04Gyats080);
    const deckBefore = [...noDon.getState().players.south.deck];
    noDon.declareAttack(chinjaoId, battleTargetId, "south");
    expect(noDon.getState().players.south.deck).toEqual(deckBefore);
    expect(noDon.getView("south").players.south.hand).toHaveLength(0);
    expect(noDon.getView("south").prompts).toHaveLength(0);
  });
});
