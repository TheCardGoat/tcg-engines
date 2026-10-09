import {
  op07Vegapunk097,
  op09Brook111,
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01YouCanBeMySamurai055,
  op13Otama043,
  op02Vista011,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Kuroobi045 } from "../../../../../cards/src/cards/characters/op14-045-kuroobi.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-045 Kuroobi", () => {
  test("opponent Brook Life Trigger grants Rush after trashing this controller's hand cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op14eb04Kuroobi045, playedOnTurn: 3 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
        hand: Array.from({ length: 6 }, () => eb01Doma005),
      },
      { leaderCardId: op07Vegapunk097, life: [op09Brook111, eb01Doma005], hand: [] },
      { firstPlayer: "north", activeSeat: "south", turnNumber: 3 },
    );
    const subjectId = engine.findCardInZone("south", "character", op14eb04Kuroobi045);
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: subjectId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (discard?.kind !== "selectEntity") throw new Error("Expected Brook discard.");
    const selectedIds = discard.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds }, "south");
    engine.declareAttack(subjectId, engine.leader("north"), "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === subjectId)?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(selectedIds),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("gains Rush this turn after its controller trashes a physical hand card for another effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: 3,
        hand: [op14eb04Kuroobi045, op13Otama043, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        activeDon: op14eb04Kuroobi045.cost + op13Otama043.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op14eb04Kuroobi045, "south");
    const kuroobiId = engine.findCardInZone("south", "character", op14eb04Kuroobi045);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: kuroobiId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);

    engine.playCard(op13Otama043, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Otama's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(discardId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");

    engine.declareAttack(kuroobiId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kuroobiId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not gain Rush merely because a Main Event card is activated and trashed by rule", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Kuroobi045, op01YouCanBeMySamurai055],
        character: [eb01Doma005, eb01Fourtricks025],
        activeDon: op14eb04Kuroobi045.cost + op01YouCanBeMySamurai055.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eventId = engine.findCardInZone("south", "hand", op01YouCanBeMySamurai055);

    engine.playCard(op14eb04Kuroobi045, "south");
    const kuroobiId = engine.findCardInZone("south", "character", op14eb04Kuroobi045);
    engine.playCard(op01YouCanBeMySamurai055, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: kuroobiId,
      targetId: engine.leader("north"),
    });
    expect(failure.accepted).toBe(false);
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kuroobiId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. draws the exact top deck card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Kuroobi045],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      { hand: [op02Vista011], activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kuroobiId = engine.findCardInZone("south", "character", op14eb04Kuroobi045);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kuroobiId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kuroobiId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
