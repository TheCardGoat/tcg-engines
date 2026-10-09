import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { merlinBaubleExpert } from "./039-merlin-bauble-expert";

const arthur = createMockCharacter({
  id: "merlin-be-arthur",
  name: "Arthur",
  cost: 2,
  strength: 1,
  willpower: 3,
});

const nonArthur = createMockCharacter({
  id: "merlin-be-non-arthur",
  name: "Not Arthur",
  cost: 2,
  strength: 1,
  willpower: 3,
});

describe("Merlin - Bauble Expert", () => {
  it("gives player two a spendable drop while their Arthur is drying", () => {
    const purchase = createMockCharacter({
      id: "merlin-drop-purchase",
      name: "Drop Purchase",
      cost: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { hand: [arthur, merlinBaubleExpert, purchase], inkwell: 5, deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(arthur)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(merlinBaubleExpert)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerTwo().getCardZone(purchase)).toBe("play");
    expect(engine.asPlayerTwo().getBagCount()).toBe(0);
  });

  it("gets 1 ink drop when played with a character named Arthur in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinBaubleExpert],
      inkwell: merlinBaubleExpert.cost,
      play: [arthur],
      deck: 1,
    });

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().playCard(merlinBaubleExpert)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("gets no ink drop without a character named Arthur in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinBaubleExpert],
      inkwell: merlinBaubleExpert.cost,
      play: [nonArthur],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(merlinBaubleExpert)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
  it("does not count an opposing Arthur or an Arthur in hand", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [merlinBaubleExpert, arthur], inkwell: merlinBaubleExpert.cost, deck: [] },
      { play: [arthur], deck: [] },
    );
    expect(engine.asPlayerOne().playCard(merlinBaubleExpert)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("gets one drop for multiple friendly Arthurs and gives none to the opponent", () => {
    const secondArthur = createMockCharacter({
      id: "merlin-second-arthur",
      name: "Arthur",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinBaubleExpert],
      play: [arthur, secondArthur],
      inkwell: merlinBaubleExpert.cost,
      deck: [],
    });
    expect(engine.asPlayerOne().playCard(merlinBaubleExpert)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("does not match Arthur as only part of a name", () => {
    const notNamedArthur = createMockCharacter({
      id: "merlin-arthur-substring",
      name: "Arthurian Knight",
      cost: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinBaubleExpert],
      play: [notNamedArthur],
      inkwell: merlinBaubleExpert.cost,
      deck: [],
    });
    expect(engine.asPlayerOne().playCard(merlinBaubleExpert)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});
