import { describe, expect, test } from "vite-plus/test";
import {
  op12Baratie080,
  op12Concasser059,
  op12LuffyIsTheManWhoWillBeKingOfThePirates079,
  op12Sanji041,
  op13Higuma013,
  op13Otama043,
  op13WindmillVillage022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-080 Baratie", () => {
  test("returns itself to the deck before Sanji searches for an Event and orders the remainder", () => {
    const wrongLeaderEngine = OnePieceTestEngine.create({
      stage: op12Baratie080,
      deck: [op13Higuma013, op13Otama043, op13WindmillVillage022],
    });
    const wrongLeaderStageId = wrongLeaderEngine.findCardInZone("south", "stage", op12Baratie080);

    wrongLeaderEngine.activateEffect(wrongLeaderStageId, "activateMain");
    wrongLeaderEngine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(wrongLeaderEngine.getView("south").players.south.stage).toBeNull();
    expect(wrongLeaderEngine.getState().players.south.deck.at(-1)).toBe(wrongLeaderStageId);
    expect(wrongLeaderEngine.getView("south").prompts).toHaveLength(0);

    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      stage: op12Baratie080,
      deck: [
        op12Concasser059,
        op13Higuma013,
        op12LuffyIsTheManWhoWillBeKingOfThePirates079,
        op13Otama043,
      ],
    });
    const stageId = engine.findCardInZone("south", "stage", op12Baratie080);
    const selectedEventId = engine.findCardInZone("south", "deck", op12Concasser059);
    const ineligibleId = engine.findCardInZone("south", "deck", op13Higuma013);
    const otherEventId = engine.findCardInZone(
      "south",
      "deck",
      op12LuffyIsTheManWhoWillBeKingOfThePirates079,
    );
    const untouchedId = engine.findCardInZone("south", "deck", op13Otama043);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchDecision.actorId).toBe("south");
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected Baratie to publish its Event selection.");
    }
    expect(searchStep).toMatchObject({ min: 0, max: 1 });
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: selectedEventId, legal: true },
      { id: ineligibleId, legal: false },
      { id: otherEventId, legal: true },
    ]);

    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedEventId] }, "south");

    const orderDecision = engine.pendingDecision("effectSearchRemainderOrder", "south");
    expect(orderDecision.steps[0]).toMatchObject({ kind: "orderItems" });
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [otherEventId, ineligibleId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.stage).toBeNull();
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([selectedEventId]);
    expect(engine.getState().players.south.deck).toEqual([
      untouchedId,
      stageId,
      otherEventId,
      ineligibleId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the defending player use its Life Trigger to play it without paying DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Higuma013, playedOnTurn: 0 }],
        activeDon: 3,
      },
      {
        life: [op12Baratie080],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(attackerId, 3, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    expect(triggerDecision).toMatchObject({ actorId: "north", kind: "confirm" });
    const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;

    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.stage?.cardId).toBe(op12Baratie080.id);
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
