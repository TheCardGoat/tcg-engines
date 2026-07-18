import { describe, expect, test } from "vite-plus/test";
import {
  eb01Blueno017,
  eb01Chambres020,
  eb01Doma005,
  eb01Koza004,
  eb01MountainGod018,
  eb01ScratchmenApoo015,
  eb02Gaimon012,
  eb02Sarfunkel014,
  op01AshuraDoji032,
  op01TrafalgarLaw002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-020 Chambres", () => {
  test("returns a chosen Character and maps only low-cost Characters of a different color", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01TrafalgarLaw002,
      hand: [
        eb01Chambres020,
        eb01ScratchmenApoo015,
        eb02Sarfunkel014,
        eb01Koza004,
        op01AshuraDoji032,
      ],
      character: [eb01Doma005, eb01Blueno017],
      activeDon: 1,
    });
    const eventId = engine.findCardInZone("south", "hand", eb01Chambres020);
    const returnedId = engine.findCardInZone("south", "character", eb01Doma005);
    const otherReturnId = engine.findCardInZone("south", "character", eb01Blueno017);
    const firstEligibleId = engine.findCardInZone("south", "hand", eb01ScratchmenApoo015);
    const selectedPlayId = engine.findCardInZone("south", "hand", eb02Sarfunkel014);
    const donBeforePlay = engine.getView("south").players.south;

    engine.playCard(eb01Chambres020);

    const returnDecision = engine.pendingDecision("effectTargetSelection", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnDecision.actorId).toBe("south");
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected Chambres to publish its Character return choice.");
    }
    expect(returnStep).toMatchObject({ min: 1, max: 1 });
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      returnedId,
      otherReturnId,
    ]);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedId] }, "south");

    const playDecision = engine.pendingDecision("effectPlaySelection", "south");
    const playStep = playDecision.steps[0];
    expect(playDecision.actorId).toBe("south");
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected Chambres to publish its different-color play choice.");
    }
    expect(playStep).toMatchObject({ min: 0, max: 1 });
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstEligibleId,
      selectedPlayId,
    ]);

    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedPlayId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.some((card) => card.instanceId === returnedId)).toBe(true);
    expect(view.players.south.characters.some((card) => card?.instanceId === selectedPlayId)).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === otherReturnId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({
      activeDon: donBeforePlay.activeDon - 1,
      restedDon: donBeforePlay.restedDon + 1,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("activates its Main swap from Life without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op01TrafalgarLaw002,
        hand: [eb01ScratchmenApoo015, eb02Sarfunkel014],
        life: [eb01Chambres020],
        character: [eb01Doma005, eb02Gaimon012],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const returnedId = engine.findCardInZone("north", "character", eb01Doma005);
    const selectedPlayId = engine.findCardInZone("north", "hand", eb02Sarfunkel014);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    const pendingView = engine.getView("north");
    expect(triggerDecision).toMatchObject({
      actorId: "north",
      kind: "confirm",
      submit: { commandType: "resolvePrompt", promptId: triggerDecision.id },
    });
    const handCountBeforeTrigger = pendingView.players.north.handCount;
    const activeDonBeforeTrigger = pendingView.players.north.activeDon;

    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedId] }, "north");

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    expect(playDecision.actorId).toBe("north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedPlayId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === selectedPlayId)).toBe(
      true,
    );
    expect(view.players.north.hand.some((card) => card.instanceId === returnedId)).toBe(true);
    expect(view.players.north.handCount).toBe(handCountBeforeTrigger);
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(eb01Chambres020.id);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
