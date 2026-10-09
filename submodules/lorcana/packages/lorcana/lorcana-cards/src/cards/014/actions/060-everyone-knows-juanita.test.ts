import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { everyoneKnowsJuanita } from "./060-everyone-knows-juanita";

const deckA = createMockCharacter({ id: "juanita-deck-a", name: "Deck A", cost: 1 });
const deckB = createMockCharacter({ id: "juanita-deck-b", name: "Deck B", cost: 1 });
const deckC = createMockCharacter({ id: "juanita-deck-c", name: "Deck C", cost: 1 });
const deckD = createMockCharacter({ id: "juanita-deck-d", name: "Deck D", cost: 1 });

const discardFillers = Array.from({ length: 10 }, (_, i) =>
  createMockAction({ id: `juanita-filler-${i}`, name: `Filler ${i}`, cost: 1 }),
);

describe("Everyone Knows Juanita", () => {
  it("draws 2 cards with fewer than 10 cards in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everyoneKnowsJuanita],
      inkwell: everyoneKnowsJuanita.cost,
      deck: [deckA, deckB],
    });

    expect(testEngine.asPlayerOne().playCard(everyoneKnowsJuanita)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("draws 3 cards instead with 10 or more cards in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [everyoneKnowsJuanita],
      inkwell: everyoneKnowsJuanita.cost,
      deck: [deckA, deckB, deckC, deckD],
      discard: discardFillers,
    });

    expect(testEngine.asPlayerOne().playCard(everyoneKnowsJuanita)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });
  for (const count of [9, 10, 11]) {
    it(`draws the correct replacement amount with ${count} existing discard cards`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [everyoneKnowsJuanita],
        inkwell: 5,
        discard: Array.from({ length: count }, (_, i) => discardFillers[i % 10]!),
        deck: [deckA, deckB, deckC, deckD],
      });
      expect(engine.asPlayerOne().playCard(everyoneKnowsJuanita)).toBeSuccessfulCommand();
      const drawn = count >= 10 ? 3 : 2;
      expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(drawn);
      expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(4 - drawn);
      expect(engine.asPlayerOne().getZonesCardCount().discard).toBe(count + 1);
      expect(engine.asPlayerOne().getCardZone(everyoneKnowsJuanita)).toBe("discard");
    });
  }

  it("ignores opposing discard cards and draws only for the controller", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [everyoneKnowsJuanita],
        inkwell: 5,
        discard: discardFillers.slice(0, 9),
        deck: [deckA, deckB, deckC, deckD],
      },
      { hand: [deckD], discard: discardFillers, deck: [deckA, deckB, deckC] },
    );
    expect(engine.asPlayerOne().playCard(everyoneKnowsJuanita)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(3);
  });

  it("can be sung by a ready cost-five character without paying ink", () => {
    const singer = createMockCharacter({ id: "juanita-singer", name: "Singer", cost: 5 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: singer, isDrying: false }],
      hand: [everyoneKnowsJuanita],
      inkwell: 0,
      discard: discardFillers,
      deck: [deckA, deckB, deckC, deckD],
    });
    expect(engine.asPlayerOne().singSong(everyoneKnowsJuanita, singer)).toBeSuccessfulCommand();
    expect(engine.isExerted(singer)).toBe(true);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(engine.getLore(PLAYER_TWO)).toBe(0);
  });

  it("rejects an insufficient singer and cannot be inked", () => {
    const singer = createMockCharacter({ id: "juanita-cheap-singer", name: "Singer", cost: 4 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: singer, isDrying: false }],
      hand: [everyoneKnowsJuanita],
      deck: [deckA, deckB],
    });
    expect(engine.asPlayerOne().singSong(everyoneKnowsJuanita, singer)).not.toBeSuccessfulCommand();
    expect(engine.isExerted(singer)).toBe(false);
    expect(engine.asPlayerOne().ink(everyoneKnowsJuanita)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(everyoneKnowsJuanita)).toBe("hand");
  });

  it("draws all remaining cards and loses only when ending the turn with an empty deck", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [everyoneKnowsJuanita], inkwell: 5, discard: discardFillers, deck: [deckA] },
      { deck: [deckB, deckC] },
    );
    expect(engine.asPlayerOne().playCard(everyoneKnowsJuanita)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    expect(engine.asPlayerOne().hasGameEnded()).toBe(false);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().hasGameEnded()).toBe(true);
    expect(engine.asServer().getWinner()).toBe(PLAYER_TWO);
  });
  it("player two sings the enhanced draw without spending ink or changing the opposing deck", () => {
    const singer = createMockCharacter({
      id: "juanita-player-two-singer",
      name: "Singer",
      cost: 5,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [deckA], discard: discardFillers.slice(0, 9), deck: 6 },
      {
        play: [singer],
        hand: [everyoneKnowsJuanita],
        discard: discardFillers,
        deck: 6,
        inkwell: 2,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = game.asPlayerTwo().getZonesCardCount();
    expect(game.asPlayerTwo().singSong(everyoneKnowsJuanita, singer)).toBeSuccessfulCommand();
    expect(game.isExerted(singer)).toBe(true);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand + 2);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 3);
    expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(11);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});

for (const count of [9, 10, 11]) {
  it(`Player Two paid draw checks ${count} existing own discard cards before the song enters discard`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { discard: discardFillers, hand: [deckD], deck: 6 },
      {
        hand: [everyoneKnowsJuanita],
        discard: Array.from({ length: count }, (_, i) => discardFillers[i % 10]!),
        deck: 6,
        inkwell: 5,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = game.asPlayerTwo().getZonesCardCount();
    expect(game.asPlayerTwo().playCard(everyoneKnowsJuanita)).toBeSuccessfulCommand();
    const drawn = count >= 10 ? 3 : 2;
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - drawn);
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand - 1 + drawn);
    expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(count + 1);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
}
for (const initialDeck of [1, 2]) {
  it(`Player Two enhanced draw takes only ${initialDeck - 1} remaining cards and waits until turn end for deck loss`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { hand: [everyoneKnowsJuanita], discard: discardFillers, deck: initialDeck, inkwell: 5 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = game.asPlayerTwo().getZonesCardCount().hand;
    expect(game.asPlayerTwo().playCard(everyoneKnowsJuanita)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before - 1 + initialDeck - 1);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(0);
    expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(11);
    expect(game.asPlayerTwo().hasGameEnded()).toBe(false);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asServer().getWinner()).toBe(PLAYER_ONE);
  });
}
