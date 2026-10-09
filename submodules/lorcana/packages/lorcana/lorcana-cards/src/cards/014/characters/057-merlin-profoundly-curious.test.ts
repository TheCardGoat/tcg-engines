import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { merlinProfoundlyCurious } from "./057-merlin-profoundly-curious";

describe("Merlin - Profoundly Curious", () => {
  it("gets 1 ink drop when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinProfoundlyCurious],
      inkwell: merlinProfoundlyCurious.cost,
      deck: 3,
    });

    expect(testEngine.asPlayerOne().playCard(merlinProfoundlyCurious)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("draws a card whenever this character quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [merlinProfoundlyCurious],
      deck: 4,
    });

    expect(testEngine.asPlayerOne().quest(merlinProfoundlyCurious)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);

    // "Whenever" — a later quest draws again (hand delta, since turns may
    // also move cards between zones).
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
    expect(testEngine.asPlayerOne().quest(merlinProfoundlyCurious)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore + 1);
  });
  it("does not trigger for another character's play or quest", () => {
    const other = createMockCharacter({ id: "merlin-other", name: "Other", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [merlinProfoundlyCurious, other],
      hand: [other],
      inkwell: 1,
      deck: 3,
    });
    const dryOther = engine.findCardInstanceId(other, "play", PLAYER_ONE);
    expect(
      engine.asPlayerOne().playCard(engine.findCardInstanceId(other, "hand", PLAYER_ONE)),
    ).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.asPlayerOne().quest(dryOther)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(3);
    expect(engine.asPlayerOne().quest(merlinProfoundlyCurious)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.getLore(PLAYER_ONE)).toBe(3);
  });

  it("can spend the entry drop to pay for a later card", () => {
    const other = createMockCharacter({ id: "merlin-drop-payment", name: "Paid Card", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinProfoundlyCurious, other],
      inkwell: 4,
      deck: 3,
    });
    expect(engine.asPlayerOne().playCard(merlinProfoundlyCurious)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.asPlayerOne().playCard(other, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.asPlayerOne().getCardZone(other)).toBe("play");
  });

  it("does not draw for challenging and cannot be put into the inkwell", () => {
    const defender = createMockCharacter({
      id: "merlin-challenge-target",
      cost: 1,
      name: "Defender",
      strength: 0,
      willpower: 4,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [merlinProfoundlyCurious], hand: [merlinProfoundlyCurious], deck: 3 },
      { play: [{ card: defender, exerted: true }], deck: 3 },
    );
    expect(
      engine
        .asPlayerOne()
        .ink(engine.findCardInstanceId(merlinProfoundlyCurious, "hand", PLAYER_ONE)),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().challenge(merlinProfoundlyCurious, defender),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(3);
  });

  it("draws nothing from an empty deck and loses when its controller ends the turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [merlinProfoundlyCurious], deck: [] },
      { deck: 2 },
    );
    expect(engine.asPlayerOne().quest(merlinProfoundlyCurious)).toBeSuccessfulCommand();
    // CR 1.8.1.2: an empty deck causes a loss at the end of the turn.
    expect(engine.asPlayerOne().hasGameEnded()).toBe(false);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asServer().getWinner()).toBe(PLAYER_TWO);
  });
  it("player-two entry drop pays a card immediately and its later quest draws only for that player", () => {
    const purchase = createMockCharacter({ id: "curious-p2-purchase", name: "Purchase", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkDrops: 2, deck: 6 },
      { hand: [merlinProfoundlyCurious, purchase], inkwell: 4, deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(merlinProfoundlyCurious)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerTwo().quest(merlinProfoundlyCurious)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = engine.asPlayerTwo().getZonesCardCount();
    const opponentBefore = engine.asPlayerOne().getZonesCardCount();
    expect(engine.asPlayerTwo().quest(merlinProfoundlyCurious)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand + 1);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 1);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(opponentBefore.hand);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(opponentBefore.deck);
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
  });
});

it("Player Two quests draw repeatedly without rewarding other quests or challenges", () => {
  const other = createMockCharacter({ id: "curious-p2-other", name: "Other", cost: 1 });
  const defender = createMockCharacter({
    id: "curious-p2-defender",
    name: "Defender",
    cost: 1,
    strength: 0,
    willpower: 4,
  });
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: defender, exerted: true }], deck: 8 },
    { play: [merlinProfoundlyCurious, other], hand: [other], inkwell: 1, deck: 8 },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const before = engine.asPlayerTwo().getZonesCardCount();
  expect(
    engine.asPlayerTwo().playCard(engine.findCardInstanceId(other, "hand", PLAYER_TWO)),
  ).toBeSuccessfulCommand();
  expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(
    engine.asPlayerTwo().quest(engine.findCardInstanceId(other, "play", PLAYER_TWO)),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().challenge(merlinProfoundlyCurious, defender)).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand - 1);
  expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck);
  for (let i = 0; i < 2; i++) {
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const own = engine.asPlayerTwo().getZonesCardCount(),
      opponent = engine.asPlayerOne().getZonesCardCount();
    expect(engine.asPlayerTwo().quest(merlinProfoundlyCurious)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(own.hand + 1);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(own.deck - 1);
    expect(engine.asPlayerOne().getZonesCardCount()).toEqual(opponent);
  }
});

it("Player Two empty-deck quest completes without a fabricated draw and loses at turn end", () => {
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { play: [merlinProfoundlyCurious], deck: 1 },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(0);
  expect(engine.asPlayerTwo().quest(merlinProfoundlyCurious)).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
  expect(engine.getLore(PLAYER_TWO)).toBe(2);
  expect(engine.asPlayerTwo().hasGameEnded()).toBe(false);
  expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(engine.asServer().getWinner()).toBe(PLAYER_ONE);
});
