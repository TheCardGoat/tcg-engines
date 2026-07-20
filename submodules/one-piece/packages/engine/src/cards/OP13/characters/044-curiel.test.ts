import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Kaido094, op02EdwardNewgate001 } from "@tcg/op-cards";
import { op13Curiel044 } from "../../../../../cards/src/cards/OP13/characters/044-curiel.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-044 Curiel", () => {
  test("when attacking gives one rested DON!! to a selected own Whitebeard Pirates Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EdwardNewgate001,
        character: [{ card: op13Curiel044, playedOnTurn: 0 }, eb01Doma005, eb01MountainGod018],
        restedDon: 1,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const curielId = engine.findCardInZone("south", "character", op13Curiel044);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const nonmatchingId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingMatchingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(curielId, engine.leader("north"), "south");
    const countDecision = engine.pendingDecision("effectGiveDonCount", "south");
    expect(countDecision.actorId).toBe("south");
    expect(countDecision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Curiel's DON!! recipient.");
    expect(target).toMatchObject({ min: 1, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), curielId, recipientId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonmatchingId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingMatchingId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose zero and cannot give an active DON!! as the required rested source", () => {
    const declined = OnePieceTestEngine.create(
      { character: [{ card: op13Curiel044, playedOnTurn: 0 }], restedDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const declinedId = declined.findCardInZone("south", "character", op13Curiel044);

    declined.declareAttack(declinedId, declined.leader("north"), "south");
    declined.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(
      declined
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === declinedId)?.attachedDon,
    ).toBe(0);
    expect(declined.getView("south").players.south.restedDon).toBe(1);
    expect(declined.getView("south").prompts).toHaveLength(0);

    const activeOnly = OnePieceTestEngine.create(
      { character: [{ card: op13Curiel044, playedOnTurn: 0 }], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const activeOnlyId = activeOnly.findCardInZone("south", "character", op13Curiel044);

    activeOnly.declareAttack(activeOnlyId, activeOnly.leader("north"), "south");
    expect(activeOnly.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 0,
    });
    expect(
      activeOnly
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === activeOnlyId)?.attachedDon,
    ).toBe(0);
    expect(activeOnly.getView("south").prompts).toHaveLength(0);
  });

  test("draws one exact card for its controller when K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Curiel044, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const curielId = engine.findCardInZone("south", "character", op13Curiel044);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, curielId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(curielId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(view.prompts).toHaveLength(0);
  });
});
