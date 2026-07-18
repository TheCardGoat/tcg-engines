import { describe, expect, test } from "vite-plus/test";
import {
  eb01DidSomeoneSayKami060,
  eb01Doma005,
  eb01MountainGod018,
  eb02Enel052,
  op05Enel100,
  op10Enel025,
  op13Higuma013,
  op13Otama043,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-060 Did Someone Say...Kami?", () => {
  test("maps cost-7-or-less Enel choices across hand and trash, then reduces Life to 1", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01DidSomeoneSayKami060, op05Enel100],
      trash: [op10Enel025, eb02Enel052],
      life: [op13Otama043, op13Higuma013, op13York094],
      activeDon: 4,
    });
    const eventId = engine.findCardInZone("south", "hand", eb01DidSomeoneSayKami060);
    const handCandidateId = engine.findCardInZone("south", "hand", op05Enel100);
    const selectedTrashId = engine.findCardInZone("south", "trash", op10Enel025);
    const tooExpensiveId = engine.findCardInZone("south", "trash", eb02Enel052);
    const removedLifeIds = [
      engine.findCardInZone("south", "life", op13Otama043),
      engine.findCardInZone("south", "life", op13Higuma013),
    ];
    const remainingLifeId = engine.findCardInZone("south", "life", op13York094);

    engine.playCard(eb01DidSomeoneSayKami060);

    const playDecision = engine.pendingDecision("effectPlaySelection", "south");
    const playStep = playDecision.steps[0];
    expect(playDecision.actorId).toBe("south");
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected Kami to publish its hand-and-trash Enel choice.");
    }
    expect(playStep).toMatchObject({ min: 0, max: 1 });
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      handCandidateId,
      selectedTrashId,
    ]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);

    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedTrashId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === selectedTrashId)).toBe(
      true,
    );
    expect(view.players.south.hand.some((card) => card.instanceId === handCandidateId)).toBe(true);
    expect(view.players.south.trash.some((card) => card.instanceId === tooExpensiveId)).toBe(true);
    expect(view.players.south.lifeCount).toBe(1);
    expect(engine.getState().players.south.life).toEqual([remainingLifeId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, tooExpensiveId, ...removedLifeIds]),
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("still reduces Life to 1 after choosing not to play an Enel", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01DidSomeoneSayKami060, op05Enel100],
      life: [op13Otama043, op13Higuma013, op13York094],
      activeDon: 4,
    });
    const enelId = engine.findCardInZone("south", "hand", op05Enel100);

    engine.playCard(eb01DidSomeoneSayKami060);

    const playDecision = engine.pendingDecision("effectPlaySelection", "south");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected Kami's optional Enel choice before its mandatory continuation.");
    }
    expect(playStep).toMatchObject({ min: 0, max: 1 });
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toContain(enelId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(enelId);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("draws 2 before mapping the mandatory Trigger discard choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb01Doma005],
        deck: [op13Otama043, op13Higuma013, op13York094, eb01Doma005],
        life: [eb01DidSomeoneSayKami060],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.endTurn("south");
    engine.endTurn("north");
    const firstDrawId = engine.findCardInZone("north", "deck", op13Higuma013);
    const secondDrawId = engine.findCardInZone("north", "deck", op13York094);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    const beforeTrigger = engine.getView("north").players.north;
    expect(triggerDecision).toMatchObject({ actorId: "north", kind: "confirm" });
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const trashDecision = engine.pendingDecision("effectTrashFromHandSelection", "north");
    const trashStep = trashDecision.steps[0];
    expect(trashDecision.actorId).toBe("north");
    expect(trashStep?.kind).toBe("selectEntity");
    if (trashStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to receive the post-draw discard choice.");
    }
    expect(trashStep).toMatchObject({ min: 1, max: 1 });
    expect(trashStep.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );

    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [firstDrawId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId]),
    );
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      eb01DidSomeoneSayKami060.id,
    );
    expect(view.players.north.hand.some((card) => card.instanceId === secondDrawId)).toBe(true);
    expect(view.players.north.handCount).toBe(beforeTrigger.handCount + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
