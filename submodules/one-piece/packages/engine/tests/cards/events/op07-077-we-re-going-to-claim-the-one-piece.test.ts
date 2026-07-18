import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Kaido061,
  op01Speed104,
  op08Pekoms029,
  op07WeReGoingToClaimTheOnePiece077,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

const SEARCH_DECK = [op01Speed104, op08Pekoms029, eb01Doma005, eb01MountainGod018, eb01Doma005];

describe("OP07-077 We're Going to Claim the One Piece!!!", () => {
  test("Main accepts an included Animal Kingdom Pirates Leader and searches either-trait cards", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01Kaido061,
      hand: [op07WeReGoingToClaimTheOnePiece077],
      deck: SEARCH_DECK,
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "deck", op01Speed104);
    const bigMomPiratesId = engine.findCardInZone("south", "deck", op08Pekoms029);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const initialDeck = [...engine.getState().players.south.deck];

    engine.playCard(op07WeReGoingToClaimTheOnePiece077);
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected the private either-trait search.");
    expect(step.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(true);
    expect(step.candidates.find((candidate) => candidate.ref.id === bigMomPiratesId)?.legal).toBe(
      true,
    );
    expect(step.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: initialDeck.filter((id) => id !== selectedId).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates the Leader-gated Main search without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op01Kaido061,
        life: [op07WeReGoingToClaimTheOnePiece077],
        deck: SEARCH_DECK.slice(0, 4),
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.pendingDecision("effectSearchSelection", "north")).toBeDefined();
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
