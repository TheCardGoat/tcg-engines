import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { goGoTomagoExtremeTester } from "./072-go-go-tomago-extreme-tester";

const attacker = createMockCharacter({
  id: "gogo-test-attacker",
  name: "First Attacker",
  cost: 2,
  strength: 0,
  willpower: 4,
});

const secondAttacker = createMockCharacter({
  id: "gogo-test-second-attacker",
  name: "Second Attacker",
  cost: 2,
  strength: 0,
  willpower: 4,
});

describe("Go Go Tomago - Extreme Tester", () => {
  it("gets her controller 1 ink drop whenever she is challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goGoTomagoExtremeTester, exerted: true }],
        deck: 2,
      },
      {
        play: [{ card: attacker, isDrying: false }],
        deck: 2,
      },
    );

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(attacker, goGoTomagoExtremeTester),
    ).toBeSuccessfulCommand();

    // GATHERING DATA queues in the bag; resolving it grants the ink drop.
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("triggers for every challenge, not just the first", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goGoTomagoExtremeTester, exerted: true }],
        deck: 2,
      },
      {
        play: [
          { card: attacker, isDrying: false },
          { card: secondAttacker, isDrying: false },
        ],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(attacker, goGoTomagoExtremeTester),
    ).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);

    expect(
      testEngine.asPlayerTwo().challenge(secondAttacker, goGoTomagoExtremeTester),
    ).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(2);
  });
});

describe("Gathering Data boundaries", () => {
  it("still awards the drop when the challenge banishes Go Go", () => {
    const lethal = createMockCharacter({
      id: "gogo-lethal",
      name: "Lethal",
      cost: 2,
      strength: 1,
      willpower: 4,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: goGoTomagoExtremeTester, exerted: true }], inkDrops: 2, deck: 6 },
      { play: [lethal], inkDrops: 3, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(lethal, goGoTomagoExtremeTester)).toBeSuccessfulCommand();
    game.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(game.asPlayerOne().getCardZone(goGoTomagoExtremeTester)).toBe("discard");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  });

  it("does not award a drop when Go Go challenges another character", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [goGoTomagoExtremeTester], deck: 6 },
      { play: [{ card: attacker, exerted: true }], deck: 6 },
    );
    expect(game.asPlayerOne().challenge(goGoTomagoExtremeTester, attacker)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("does not award a drop for an illegal challenge against ready Go Go", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [goGoTomagoExtremeTester], deck: 6 },
      { play: [attacker], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().challenge(attacker, goGoTomagoExtremeTester),
    ).not.toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("keeps an awarded drop through the turn change and spends it on a card", () => {
    const purchase = createMockCharacter({ id: "gogo-purchase", name: "Purchase", cost: 1 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: goGoTomagoExtremeTester, exerted: true }], hand: [purchase], deck: 6 },
      { play: [attacker], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(attacker, goGoTomagoExtremeTester)).toBeSuccessfulCommand();
    game.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getCardZone(purchase)).toBe("play");
  });
  it("player two receives repeated defending rewards and keeps the lethal reward", () => {
    const lethal = createMockCharacter({
      id: "gogo-player-two-lethal",
      cost: 1,
      name: "Lethal",
      strength: 1,
      willpower: 4,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [attacker, secondAttacker, lethal], inkDrops: 4, deck: 6 },
      { play: [{ card: goGoTomagoExtremeTester, exerted: true }], inkDrops: 2, deck: 6 },
    );
    for (const challenger of [attacker, secondAttacker, lethal]) {
      expect(
        game.asPlayerOne().challenge(challenger, goGoTomagoExtremeTester),
      ).toBeSuccessfulCommand();
      game.asPlayerTwo().resolveAllBagEffects({ maxIterations: 10 });
    }
    expect(game.getInkDrops(PLAYER_TWO)).toBe(5);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerTwo().getCardZone(goGoTomagoExtremeTester)).toBe("discard");
    expect(game.asPlayerOne().getCardZone(lethal)).toBe("play");
    expect(game.asPlayerOne().getDamage(lethal)).toBe(2);
  });
  it("when exact opposing Go Go copies challenge each other, only the defender's controller gains a drop", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: goGoTomagoExtremeTester, exerted: true }], inkDrops: 1, deck: 6 },
      { play: [goGoTomagoExtremeTester], inkDrops: 2, deck: 6 },
    );
    const defender = game.findCardInstanceId(goGoTomagoExtremeTester, "play", PLAYER_ONE);
    const challenger = game.findCardInstanceId(goGoTomagoExtremeTester, "play", PLAYER_TWO);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(challenger, defender)).toBeSuccessfulCommand();
    game.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerOne().getCardZone(defender)).toBe("discard");
    expect(game.asPlayerTwo().getCardZone(challenger)).toBe("discard");
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
});
