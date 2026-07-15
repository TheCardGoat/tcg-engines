import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { captainHookThePirateKing } from "./109-captain-hook-the-pirate-king";

const pirateAlly = createMockCharacter({
  id: "captain-hook-pirate-ally",
  name: "Pirate Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Pirate"],
});

const nonPirateAlly = createMockCharacter({
  id: "captain-hook-non-pirate-ally",
  name: "Non Pirate Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

const opposingCharacter = createMockCharacter({
  id: "captain-hook-opponent-character",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const damageAction = createMockAction({
  id: "captain-hook-damage-action",
  name: "Damage Action",
  cost: 1,
  text: "Deal 1 damage to chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
    },
  ],
});

describe("Captain Hook - The Pirate King", () => {
  it("boosts your Pirates when an opposing character is damaged during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: captainHookThePirateKing, isDrying: false },
          { card: pirateAlly, isDrying: false },
          { card: nonPirateAlly, isDrying: false },
        ],
        deck: 5,
      },
      {
        play: [{ card: opposingCharacter, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(captainHookThePirateKing, opposingCharacter),
    ).toBeSuccessfulCommand();

    const bagEffect = testEngine.asPlayerOne().getBagEffects()[0];
    if (bagEffect) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(captainHookThePirateKing),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getCard(captainHookThePirateKing).strength).toBe(6);
    expect(testEngine.asPlayerOne().getKeywordValue(captainHookThePirateKing, "Resist")).toBe(2);
    expect(testEngine.asPlayerOne().getCard(pirateAlly).strength).toBe(4);
    expect(testEngine.asPlayerOne().getKeywordValue(pirateAlly, "Resist")).toBe(2);
    expect(testEngine.asPlayerOne().getCard(nonPirateAlly).strength).toBe(2);
    expect(testEngine.asPlayerOne().getKeywordValue(nonPirateAlly, "Resist")).toBeNull();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(captainHookThePirateKing).strength).toBe(4);
    expect(testEngine.asPlayerOne().getKeywordValue(captainHookThePirateKing, "Resist")).toBeNull();
    expect(testEngine.asPlayerOne().getCard(pirateAlly).strength).toBe(2);
    expect(testEngine.asPlayerOne().getKeywordValue(pirateAlly, "Resist")).toBeNull();
    expect(testEngine.asPlayerOne().getCard(nonPirateAlly).strength).toBe(2);
    expect(testEngine.asPlayerOne().getKeywordValue(nonPirateAlly, "Resist")).toBeNull();
  });

  it("does not boost your Pirates when an opposing character is damaged on an opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: captainHookThePirateKing, isDrying: false },
          { card: pirateAlly, isDrying: false },
          { card: nonPirateAlly, isDrying: false },
        ],
        deck: 5,
      },
      {
        play: [{ card: opposingCharacter, isDrying: false }],
        hand: [damageAction],
        inkwell: damageAction.cost,
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().playCard(damageAction, { targets: [opposingCharacter] }),
    ).toBeSuccessfulCommand();

    const bagEffect = testEngine.asPlayerOne().getBagEffects()[0];
    if (bagEffect) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(captainHookThePirateKing),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getCard(captainHookThePirateKing).strength).toBe(4);
    expect(testEngine.asPlayerOne().getKeywordValue(captainHookThePirateKing, "Resist")).toBeNull();
    expect(testEngine.asPlayerOne().getCard(pirateAlly).strength).toBe(2);
    expect(testEngine.asPlayerOne().getKeywordValue(pirateAlly, "Resist")).toBeNull();
    expect(testEngine.asPlayerOne().getCard(nonPirateAlly).strength).toBe(2);
    expect(testEngine.asPlayerOne().getKeywordValue(nonPirateAlly, "Resist")).toBeNull();
  });
});
