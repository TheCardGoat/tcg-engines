import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { magnificentMarvelous } from "./064-magnificent-marvelous";

const deckFillerA = createMockCharacter({ id: "mm-deck-a", name: "Deck Filler A", cost: 1 });
const deckFillerB = createMockCharacter({ id: "mm-deck-b", name: "Deck Filler B", cost: 1 });

describe("Magnificent, Marvelous", () => {
  it("gives the controller 2 lore and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [magnificentMarvelous],
      inkwell: magnificentMarvelous.cost,
      deck: [deckFillerA, deckFillerB],
    });

    expect(testEngine.asPlayerOne().playCard(magnificentMarvelous)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
  it("adds lore to the controller's total and draws only for that player", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [magnificentMarvelous], inkwell: 4, lore: 5, deck: [deckFillerA, deckFillerB] },
      { hand: [deckFillerA], lore: 7, deck: [deckFillerB] },
    );
    expect(engine.asPlayerOne().playCard(magnificentMarvelous)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(7);
    expect(engine.getLore(PLAYER_TWO)).toBe(7);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(1);
    expect(engine.asPlayerOne().getCardZone(magnificentMarvelous)).toBe("discard");
  });

  it("can be sung by a ready cost-four character without bank ink", () => {
    const singer = createMockCharacter({ id: "mm-singer-four", name: "Singer Four", cost: 4 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [magnificentMarvelous],
      play: [singer],
      inkwell: 0,
      deck: [deckFillerA, deckFillerB],
    });
    expect(engine.asPlayerOne().singSong(magnificentMarvelous, singer)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(singer)).toBe(true);
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getCardZone(magnificentMarvelous)).toBe("discard");
  });

  it("rejects a cost-three singer and cannot be inked", () => {
    const singer = createMockCharacter({ id: "mm-singer-three", name: "Singer Three", cost: 3 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [magnificentMarvelous],
      play: [singer],
      inkwell: 0,
      deck: [deckFillerA],
    });
    expect(engine.asPlayerOne().singSong(magnificentMarvelous, singer)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().ink(magnificentMarvelous)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(singer)).toBe(false);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(engine.asPlayerOne().getCardZone(magnificentMarvelous)).toBe("hand");
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });

  it("rejects payment below four before lore or draw changes", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [magnificentMarvelous],
      inkwell: 3,
      deck: [deckFillerA],
    });
    expect(engine.asPlayerOne().playCard(magnificentMarvelous)).not.toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(engine.asPlayerOne().getCardZone(magnificentMarvelous)).toBe("hand");
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });

  it("gains lore with an empty deck and loses only when ending the turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [magnificentMarvelous], inkwell: 4, deck: [] },
      { deck: [deckFillerA] },
    );
    expect(engine.asPlayerOne().playCard(magnificentMarvelous)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(engine.asPlayerOne().hasGameEnded()).toBe(false);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().hasGameEnded()).toBe(true);
    expect(engine.asServer().getWinner()).toBe(PLAYER_TWO);
  });
  it("player two sings at exact cost four and receives only their own lore and draw", () => {
    const singer = createMockCharacter({ id: "mm-player-two-singer", name: "Singer", cost: 4 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [deckFillerA], lore: 7, deck: 6 },
      { hand: [magnificentMarvelous], play: [singer], lore: 5, deck: 6, inkwell: 2 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = game.asPlayerTwo().getZonesCardCount();
    expect(game.asPlayerTwo().singSong(magnificentMarvelous, singer)).toBeSuccessfulCommand();
    expect(game.isExerted(singer)).toBe(true);
    expect(game.getLore(PLAYER_TWO)).toBe(7);
    expect(game.getLore(PLAYER_ONE)).toBe(7);
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 1);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().getCardZone(magnificentMarvelous)).toBe("discard");
  });
});

it("Player Two mixed payment gains exactly two lore and draws one only for the controller", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [deckFillerA], lore: 7, deck: 6, inkDrops: 4 },
    { hand: [magnificentMarvelous], inkwell: 3, inkDrops: 1, lore: 5, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const before = game.asPlayerTwo().getZonesCardCount();
  expect(
    game.asPlayerTwo().playCard(magnificentMarvelous, { inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(7);
  expect(game.getLore(PLAYER_ONE)).toBe(7);
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand);
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 1);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
});
for (const initialDeck of [1, 2]) {
  it(`Player Two sung effect gains lore with ${initialDeck - 1} card remaining and waits for turn-end deck loss`, () => {
    const singer = createMockCharacter({ id: "mm-p2-empty-singer", name: "Singer", cost: 4 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { lore: 7, deck: 6 },
      { play: [singer], hand: [magnificentMarvelous], lore: 5, deck: initialDeck, inkwell: 2 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = game.asPlayerTwo().getZonesCardCount().hand;
    expect(game.asPlayerTwo().singSong(magnificentMarvelous, singer)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(7);
    expect(game.getLore(PLAYER_ONE)).toBe(7);
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before - 1 + initialDeck - 1);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(0);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(game.isExerted(singer)).toBe(true);
    expect(game.asPlayerTwo().getCardZone(magnificentMarvelous)).toBe("discard");
    expect(game.asPlayerTwo().hasGameEnded()).toBe(false);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asServer().getWinner()).toBe(PLAYER_ONE);
  });
}
it("Player Two rejected payment and a cost-three singer preserve lore, draw, ink and singer state", () => {
  const singer = createMockCharacter({ id: "mm-p2-invalid-singer", name: "Short Singer", cost: 3 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { lore: 7, deck: 6 },
    { play: [singer], hand: [magnificentMarvelous], lore: 5, deck: 6, inkwell: 3 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const before = game.asPlayerTwo().getZonesCardCount();
  expect(game.asPlayerTwo().playCard(magnificentMarvelous)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().singSong(magnificentMarvelous, singer)).not.toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand);
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(3);
  expect(game.isExerted(singer)).toBe(false);
  expect(game.asPlayerTwo().getCardZone(magnificentMarvelous)).toBe("hand");
});
