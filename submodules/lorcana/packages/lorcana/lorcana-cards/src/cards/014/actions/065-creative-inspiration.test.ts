import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli, arielOnHumanLegs, healingGlow, simbaProtectiveCub } from "../../001";
import { creativeInspiration } from "./065-creative-inspiration";

describe("Creative Inspiration", () => {
  it("draws 4 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [creativeInspiration],
      inkwell: creativeInspiration.cost,
      deck: [aladdinPrinceAli, arielOnHumanLegs, healingGlow, simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCard(creativeInspiration)).toBeSuccessfulCommand();

    // Play the action from hand (-1), then draw 4.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(4);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
  });

  it("costs 7 ink to play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [creativeInspiration],
      inkwell: creativeInspiration.cost - 1,
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(creativeInspiration)).toMatchObject({
      success: false,
    });
    expect(testEngine.asPlayerOne().getCardZone(creativeInspiration)).toBe("hand");
  });
  it("draws exactly four for the controller and leaves opposing zones unchanged", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [creativeInspiration, healingGlow],
        inkwell: 7,
        deck: [aladdinPrinceAli, arielOnHumanLegs, healingGlow, simbaProtectiveCub, healingGlow],
      },
      { hand: [simbaProtectiveCub], deck: [healingGlow, arielOnHumanLegs] },
    );
    expect(engine.asPlayerOne().playCard(creativeInspiration)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(5);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(engine.asPlayerOne().getCardZone(creativeInspiration)).toBe("discard");
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(2);
  });

  for (const remaining of [0, 2]) {
    it(`draws the remaining ${remaining} cards and loses only at the turn boundary`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [creativeInspiration],
          inkwell: 7,
          deck: [aladdinPrinceAli, healingGlow].slice(0, remaining),
        },
        { deck: [simbaProtectiveCub, arielOnHumanLegs] },
      );
      expect(engine.asPlayerOne().playCard(creativeInspiration)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(remaining);
      expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(0);
      expect(engine.asPlayerOne().hasGameEnded()).toBe(false);
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().hasGameEnded()).toBe(true);
      expect(engine.asServer().getWinner()).toBe(PLAYER_TWO);
    });
  }

  it("can be inked and is not a song", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [creativeInspiration],
      play: [aladdinPrinceAli],
      deck: [healingGlow],
    });
    expect(
      engine.asPlayerOne().singSong(creativeInspiration, aladdinPrinceAli),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(aladdinPrinceAli)).toBe(false);
    expect(engine.asPlayerOne().ink(creativeInspiration)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(creativeInspiration)).toBe("inkwell");
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });
  it("player two draws only their remaining cards and loses at their own turn end", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6, hand: [healingGlow] },
      {
        hand: [creativeInspiration],
        deck: [aladdinPrinceAli, arielOnHumanLegs, simbaProtectiveCub],
        inkwell: 7,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // The normal turn-start draw leaves two available cards for the action.
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(2);
    expect(game.asPlayerTwo().playCard(creativeInspiration)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(3);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(0);
    expect(game.asPlayerTwo().getCardZone(creativeInspiration)).toBe("discard");
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(game.asServer().hasGameEnded()).toBe(false);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asServer().hasGameEnded()).toBe(true);
    expect(game.asServer().getWinner()).toBe(PLAYER_ONE);
  });
});

it("Player Two draws exactly four with mixed payment and preserves opposing cards and drops", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [healingGlow], deck: 6, inkDrops: 4 },
    { hand: [creativeInspiration], deck: 6, inkwell: 6, inkDrops: 1 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const before = game.asPlayerTwo().getZonesCardCount();
  expect(game.asPlayerTwo().playCard(creativeInspiration, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand + 3);
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 4);
  expect(game.asPlayerTwo().getCardZone(creativeInspiration)).toBe("discard");
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
});
it("Player Two empty-deck action draws no cards and waits until own turn end for loss", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { hand: [creativeInspiration], deck: [healingGlow], inkwell: 7 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(0);
  expect(game.asPlayerTwo().playCard(creativeInspiration)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(1);
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(0);
  expect(game.asPlayerTwo().getCardZone(creativeInspiration)).toBe("discard");
  expect(game.asServer().hasGameEnded()).toBe(false);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asServer().getWinner()).toBe(PLAYER_ONE);
});
it("Player Two rejected payment does not draw, discard or spend ink", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { hand: [creativeInspiration], deck: 6, inkwell: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const before = game.asPlayerTwo().getZonesCardCount();
  expect(game.asPlayerTwo().playCard(creativeInspiration)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand);
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck);
  expect(game.asPlayerTwo().getCardZone(creativeInspiration)).toBe("hand");
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(6);
  expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(0);
});
