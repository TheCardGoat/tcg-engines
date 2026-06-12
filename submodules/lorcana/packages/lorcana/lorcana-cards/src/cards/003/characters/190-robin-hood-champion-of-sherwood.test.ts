import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { robinHoodChampionOfSherwood } from "./190-robin-hood-champion-of-sherwood";

const weakOpponent = createMockCharacter({
  id: "robin-hood-weak-opponent",
  name: "Weak Opponent",
  cost: 1,
  willpower: 1,
  strength: 1,
});

const toughOpponent = createMockCharacter({
  id: "robin-hood-tough-opponent",
  name: "Tough Opponent",
  cost: 3,
  willpower: 10,
  strength: 1,
});

const strongAttacker = createMockCharacter({
  id: "robin-hood-strong-attacker",
  name: "Strong Attacker",
  cost: 3,
  strength: 7,
  willpower: 5,
});

const lethalAttacker = createMockCharacter({
  id: "robin-hood-lethal-attacker",
  name: "Lethal Attacker",
  cost: 3,
  strength: 10,
  willpower: 5,
});

describe("Robin Hood - Champion of Sherwood", () => {
  it("has Shift 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [robinHoodChampionOfSherwood],
    });

    expect(testEngine.asPlayerOne().hasKeyword(robinHoodChampionOfSherwood, "Shift")).toBe(true);
  });

  describe("SKILLED COMBATANT - During your turn, whenever this character banishes another character in a challenge, gain 2 lore.", () => {
    it("gains 2 lore when Robin Hood banishes a character in a challenge during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodChampionOfSherwood],
          lore: 0,
        },
        {
          play: [{ card: weakOpponent, exerted: true }],
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().challenge(robinHoodChampionOfSherwood, weakOpponent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(weakOpponent)).toBe("discard");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });

    it("does not gain lore when Robin Hood does not banish the defender", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodChampionOfSherwood],
          lore: 0,
        },
        {
          play: [{ card: toughOpponent, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(robinHoodChampionOfSherwood, toughOpponent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(toughOpponent)).toBe("play");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("does not gain lore during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: robinHoodChampionOfSherwood, exerted: true }],
          lore: 0,
        },
        {
          play: [strongAttacker],
          lore: 0,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const p2LoreBefore = testEngine.getLore(PLAYER_TWO);
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, robinHoodChampionOfSherwood),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(robinHoodChampionOfSherwood)).toBe("discard");
      expect(testEngine.getLore(PLAYER_TWO)).toBe(p2LoreBefore);
    });
  });

  describe("THE GOOD OF OTHERS - When this character is banished in a challenge, you may draw a card.", () => {
    it("triggers and draws a card when Robin Hood is banished in a challenge during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodChampionOfSherwood],
          deck: 2,
        },
        {
          play: [{ card: lethalAttacker, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(robinHoodChampionOfSherwood, lethalAttacker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(robinHoodChampionOfSherwood)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("draws a card when the optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodChampionOfSherwood],
          deck: 2,
        },
        {
          play: [{ card: lethalAttacker, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(robinHoodChampionOfSherwood, lethalAttacker),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(robinHoodChampionOfSherwood, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 1 });
    });

    it("does not draw a card when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodChampionOfSherwood],
          deck: 2,
        },
        {
          play: [{ card: lethalAttacker, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(robinHoodChampionOfSherwood, lethalAttacker),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(robinHoodChampionOfSherwood, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 2 });
    });

    it("triggers when Robin Hood is challenged and banished during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: robinHoodChampionOfSherwood, exerted: true }],
          deck: 2,
        },
        {
          play: [strongAttacker],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, robinHoodChampionOfSherwood),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(robinHoodChampionOfSherwood)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("draws a card when banished during opponent's turn and optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: robinHoodChampionOfSherwood, exerted: true }],
          deck: 2,
        },
        {
          play: [strongAttacker],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, robinHoodChampionOfSherwood),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(robinHoodChampionOfSherwood, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 1 });
    });
  });

  it("regression: THE GOOD OF OTHERS should not trigger when banished by an action (only in challenge)", () => {
    // Bug: Robin Hood's draw was triggering on action banish, but it should
    // only trigger when banished in a challenge.
    const banishAction = createMockAction({
      id: "robin-hood-banish-action",
      name: "Test Banish Action",
      cost: 3,
      text: "Banish chosen character.",
      abilities: [
        {
          effect: {
            target: {
              cardTypes: ["character" as const],
              count: 1,
              owner: "any" as const,
              selector: "chosen" as const,
              zones: ["play" as const],
            },
            type: "banish" as const,
          },
          type: "action" as const,
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [robinHoodChampionOfSherwood],
        deck: 3,
      },
      {
        hand: [banishAction],
        inkwell: banishAction.cost,
        deck: 3,
      },
    );

    // Pass turn to player two
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Player two plays an action to banish Robin Hood
    expect(
      testEngine.asPlayerTwo().playCard(banishAction, { targets: [robinHoodChampionOfSherwood] }),
    ).toBeSuccessfulCommand();

    // Robin Hood should be banished
    expect(testEngine.asPlayerOne().getCardZone(robinHoodChampionOfSherwood)).toBe("discard");

    // THE GOOD OF OTHERS should NOT trigger (banished by action, not in challenge)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
