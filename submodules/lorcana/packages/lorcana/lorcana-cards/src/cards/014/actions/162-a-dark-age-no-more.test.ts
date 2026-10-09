// Rules grounding: A Dark Age No More inks the top card of your deck facedown
// and exerted, and creates 1 ink drop that can pay ink costs.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { aDarkAgeNoMore } from "./162-a-dark-age-no-more";

const topDeckCard = createMockCharacter({
  id: "dark-age-top-deck",
  name: "Top Deck Card",
  cost: 2,
  inkable: false,
  strength: 1,
  willpower: 2,
});

describe("A Dark Age No More", () => {
  it("the gained ink drop can pay one ink without readying the new ink card", () => {
    const purchase = createMockCharacter({ id: "dark-age-purchase", name: "Purchase", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [aDarkAgeNoMore, purchase],
      inkwell: 3,
      deck: [topDeckCard],
    });
    expect(g.asPlayerOne().playCard(aDarkAgeNoMore)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(purchase)).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.isExerted(topDeckCard)).toBe(true);
    expect(g.asPlayerOne().getCardZone(purchase)).toBe("play");
  });

  it("player two inks the exact duplicate top instance and gains only their own drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [topDeckCard, topDeckCard], inkwell: 1 },
      { hand: [aDarkAgeNoMore], inkwell: 3, deck: [topDeckCard, topDeckCard, topDeckCard] },
    );
    const opponentDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const [belowId, topId] = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerTwo().playCard(aDarkAgeNoMore)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([belowId!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toContain(topId!);
    expect(g.isCardFaceDown(topId!, "inkwell", PLAYER_TWO)).toBe(true);
    expect(g.isExerted(topId!)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opponentDeck);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
  });

  it("inks the exact top of a two-card deck without increasing ready ink", () => {
    const below = createMockCharacter({ id: "dark-age-below", name: "Below", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [aDarkAgeNoMore],
      inkwell: 4,
      deck: [below, topDeckCard],
    });
    expect(g.asPlayerOne().playCard(aDarkAgeNoMore)).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([below.id]);
    expect(g.asPlayerOne().getCardZone(topDeckCard)).toBe("inkwell");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(5);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("still gets an ink drop when the deck is empty", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [aDarkAgeNoMore],
      inkwell: 3,
      deck: [],
    });
    expect(g.asPlayerOne().playCard(aDarkAgeNoMore)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().getCardZone(aDarkAgeNoMore)).toBe("discard");
    expect(g.asServer().getWinner()).toBeUndefined();
  });

  it("cannot be inked and rejects without changing hand or ready ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [aDarkAgeNoMore],
      inkwell: 2,
      deck: 3,
    });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, aDarkAgeNoMore)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(aDarkAgeNoMore)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
  });

  it("puts the top card of your deck into your inkwell facedown and exerted, and gets 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [aDarkAgeNoMore],
      inkwell: aDarkAgeNoMore.cost,
      deck: [topDeckCard],
    });

    expect(testEngine.asPlayerOne().playCard(aDarkAgeNoMore)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("inkwell");
    expect(testEngine.isExerted(topDeckCard)).toBe(true);
    expect(testEngine.isCardFaceDown(topDeckCard, "inkwell", PLAYER_ONE)).toBe(true);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("keeps unspent ink drops for later turns", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [aDarkAgeNoMore],
        inkwell: aDarkAgeNoMore.cost,
        deck: 4,
      },
      { deck: 4 },
    );

    expect(testEngine.asPlayerOne().playCard(aDarkAgeNoMore)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asServer().getWinner()).toBeUndefined();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("costs 3 ink to play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [aDarkAgeNoMore],
      inkwell: aDarkAgeNoMore.cost - 1,
      deck: [topDeckCard],
    });

    expect(testEngine.asPlayerOne().playCard(aDarkAgeNoMore).success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(aDarkAgeNoMore)).toBe("hand");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});
