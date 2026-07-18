import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb02Vegapunk056,
  op07HePossessesTheWorldSMostBrilliantMind114,
  op13Edison102,
  op13Pythagoras111,
  op13Vegapunk112,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-056 Vegapunk", () => {
  test("plays only an eligible included Scientist, orders the rest, trashes a card, and blocks", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02Vegapunk056, eb01Doma005, eb01Fourtricks025],
        deck: [
          op13Edison102,
          op13Pythagoras111,
          op13Vegapunk112,
          op07HePossessesTheWorldSMostBrilliantMind114,
          eb01Doma005,
          eb01Fourtricks025,
        ],
        activeDon: 5,
      },
      {
        character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const edisonId = engine.findCardInZone("south", "deck", op13Edison102);
    const expensiveId = engine.findCardInZone("south", "deck", op13Pythagoras111);
    const excludedNameId = engine.findCardInZone("south", "deck", op13Vegapunk112);
    const wrongCategoryId = engine.findCardInZone(
      "south",
      "deck",
      op07HePossessesTheWorldSMostBrilliantMind114,
    );
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(eb02Vegapunk056, "south");
    const vegapunkId = engine.findCardInZone("south", "character", eb02Vegapunk056);
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Vegapunk's Scientist search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === edisonId)?.legal).toBe(true);
    for (const excludedId of [expensiveId, excludedNameId, wrongCategoryId, wrongTraitId]) {
      expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
        false,
      );
    }
    engine.resolveDecision("effectSearchSelection", { selectedIds: [edisonId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Vegapunk's deck-bottom order.");
    const orderedRemainder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: orderedRemainder },
      "south",
    );

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Vegapunk's hand trash choice.");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === edisonId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(orderedRemainder);

    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Vegapunk's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", vegapunkId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [vegapunkId] }, "south");

    const counter = engine.getView("south").decisions.flatMap((decision) => decision.steps)[0];
    if (counter?.kind === "selectEntity") {
      engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    }

    view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(vegapunkId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("draws one through its public Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005],
      },
      {
        life: [eb02Vegapunk056, eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const triggerId = engine.findCardInZone("north", "life", eb02Vegapunk056);
    const drawnId = engine.findCardInZone("north", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
