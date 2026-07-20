import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op14eb04Urouge002 } from "../../../../../cards/src/cards/OP14EB04/characters/002-urouge.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-002 Urouge", () => {
  test("at 5000 power draws first, then may K.O. one opposing Character with 3000 base power or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Urouge002, playedOnTurn: 0 }],
        deck: [eb01Fourtricks025, eb01Doma005],
        activeDon: 3,
      },
      { character: [eb01Doma005, eb01MountainGod018], hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const urougeId = engine.findCardInZone("south", "character", op14eb04Urouge002);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const ineligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(urougeId, 3, "south");
    engine.declareAttack(urougeId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south");
    expect(target.actorId).toBe("south");
    const targetStep = target.steps[0];
    if (targetStep?.kind !== "selectEntity") throw new Error("Expected Urouge's K.O. choice.");
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawnId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(ineligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the K.O. after the mandatory draw", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Urouge002, playedOnTurn: 0 }],
        deck: [eb01Fourtricks025, eb01Doma005],
        activeDon: 3,
      },
      { character: [eb01Doma005], hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const urougeId = engine.findCardInZone("south", "character", op14eb04Urouge002);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.attachDon(urougeId, 3, "south");
    engine.declareAttack(urougeId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("below 5000 power neither draws nor offers the K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Urouge002, playedOnTurn: 0 }],
        deck: [eb01Fourtricks025, eb01Doma005],
        activeDon: 2,
      },
      { character: [eb01Doma005], hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const urougeId = engine.findCardInZone("south", "character", op14eb04Urouge002);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.attachDon(urougeId, 2, "south");
    engine.declareAttack(urougeId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(0);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
