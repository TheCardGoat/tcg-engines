/**
 * Deck-look privacy: looked-at cards must be visible to the controller
 * (and judges) in the filtered projection so live UIs can render faces
 * without a side-channel definition lookup. Opponents keep seeing
 * face-down stubs.
 */

import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "../index.ts";

const lookAtTopFour: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    {
      action: {
        action: "lookAtTopDeck",
        count: 4,
        return: "chooseTop",
        randomizeRemainingToBottom: true,
        tutorFilter: {
          owner: "friendly",
          count: 1,
          cardType: "command",
          attributeFilters: [
            {
              attribute: "trait",
              comparison: "includes",
              value: "special move",
            },
          ],
        },
      },
    },
  ],
  sourceText:
    "Look at the top 4 cards of your deck. You may reveal 1 (Special Move) Command among them.",
};

function openDeckLook() {
  const specialMove = createMockCommand({
    name: "Eligible Special Move",
    traits: ["special move"],
  });
  const ordinary = createMockCommand({ name: "Ordinary", traits: ["academy"] });
  const unit = createMockUnit({ name: "Filler Unit" });
  const source = createMockUnit({ name: "Looker", effects: [lookAtTopFour] });
  const engine = GundamTestEngine.create({
    play: [source],
    deck: [specialMove, ordinary, unit, createMockUnit({ name: "Fourth" })],
  });
  const p1 = engine.asPlayer(PLAYER_ONE);
  const sourceId = p1.getCardsInZone("battleArea")[0]!;
  expectSuccess(p1.activateAbility(sourceId, 0));
  return { engine, p1 };
}

describe("getFilteredView — deck-look authorized reveals", () => {
  it("shows looked-at deck identities to the controller", () => {
    const { engine, p1 } = openDeckLook();
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected deckLook choice");
    expect(choice.revealedCardIds).toHaveLength(4);
    expect(choice.legalTutorCardIds).toHaveLength(1);

    const view = engine.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(PLAYER_ONE),
    });
    const deck = view.zones.zones[`deck:${PLAYER_ONE}`];
    expect(deck).toBeDefined();

    const revealed = deck!.cards.filter((card) => choice.revealedCardIds.includes(card.instanceId));
    expect(revealed).toHaveLength(4);
    for (const card of revealed) {
      expect(card.faceDown).toBe(false);
      expect(card.definitionId).toBeTruthy();
      expect(card.definition).not.toBeNull();
    }

    // The rest of the deck (if any) stays secret.
    const hidden = deck!.cards.filter((card) => !choice.revealedCardIds.includes(card.instanceId));
    for (const card of hidden) {
      expect(card.faceDown).toBe(true);
      expect(card.definitionId).toBeNull();
    }
  });

  it("keeps looked-at deck identities hidden from the opponent", () => {
    const { engine, p1 } = openDeckLook();
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected deckLook choice");

    const opponentView = engine.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(PLAYER_TWO),
    });
    const deck = opponentView.zones.zones[`deck:${PLAYER_ONE}`];
    expect(deck).toBeDefined();

    const lookedAt = deck!.cards.filter((card) => choice.revealedCardIds.includes(card.instanceId));
    expect(lookedAt).toHaveLength(4);
    for (const card of lookedAt) {
      expect(card.faceDown).toBe(true);
      expect(card.definitionId).toBeNull();
      expect(card.definition).toBeNull();
    }
  });

  it("keeps deck cards hidden for spectators even while a deck-look is pending", () => {
    const { engine, p1 } = openDeckLook();
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected deckLook choice");

    const spectatorView = engine.runtime.getFilteredView({ role: "spectator" });
    const deck = spectatorView.zones.zones[`deck:${PLAYER_ONE}`];
    expect(deck).toBeDefined();

    const lookedAt = deck!.cards.filter((card) => choice.revealedCardIds.includes(card.instanceId));
    expect(lookedAt).toHaveLength(4);
    for (const card of lookedAt) {
      expect(card.faceDown).toBe(true);
      expect(card.definitionId).toBeNull();
      expect(card.definition).toBeNull();
    }
  });

  it("does not upgrade deck cards when no effect is pending", () => {
    const engine = GundamTestEngine.create({
      play: [createMockUnit({ name: "Idle Unit" })],
      deck: [
        createMockCommand({ traits: ["special move"] }),
        createMockUnit(),
        createMockUnit(),
        createMockUnit(),
      ],
    });
    expect(engine.runtime.getState().G.pendingEffects).toHaveLength(0);

    const view = engine.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(PLAYER_ONE),
    });
    const deck = view.zones.zones[`deck:${PLAYER_ONE}`];
    expect(deck).toBeDefined();
    expect(deck!.cards.length).toBeGreaterThan(0);
    for (const card of deck!.cards) {
      expect(card.faceDown).toBe(true);
      expect(card.definitionId).toBeNull();
    }
  });
});
