import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrumpeter } from "./182-mickey-mouse-trumpeter";

const characterToPlay = createMockCharacter({
  id: "trumpeter-003-target-char",
  name: "Character To Play",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const expensiveCharacter = createMockCharacter({
  id: "trumpeter-003-expensive-char",
  name: "Expensive Character",
  cost: 9,
  strength: 5,
  willpower: 4,
  lore: 2,
});

describe("Mickey Mouse - Trumpeter (set 003)", () => {
  it("has the expected printed metadata", () => {
    expect(mickeyMouseTrumpeter).toMatchObject({
      id: "hh8",
      cardType: "character",
      name: "Mickey Mouse",
      version: "Trumpeter",
      set: "003",
      cardNumber: 182,
      cost: 4,
      strength: 0,
      willpower: 1,
      lore: 1,
      inkable: false,
    });
  });

  describe("SOUND THE CALL - {E}, 2 {I} — Play a character for free.", () => {
    it("activates ability to play a character for free from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseTrumpeter, isDrying: false }],
          hand: [characterToPlay],
          inkwell: 2,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter, {
          targets: [characterToPlay],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(characterToPlay)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(mickeyMouseTrumpeter)).toBe(true);
    });

    it("plays an expensive character for free without spending ink on the character cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseTrumpeter, isDrying: false }],
          hand: [expensiveCharacter],
          inkwell: 2,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter, {
          targets: [expensiveCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).toBe("play");
    });

    it("fails when there is not enough ink to pay the 2 ink cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseTrumpeter, isDrying: false }],
          hand: [characterToPlay],
          inkwell: 1,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter, {
        targets: [characterToPlay],
      });

      expect(result.success).toBe(false);
    });

    it("exerts Mickey Mouse after the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseTrumpeter, isDrying: false }],
          hand: [characterToPlay],
          inkwell: 2,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().isExerted(mickeyMouseTrumpeter)).toBe(false);

      testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter, {
        targets: [characterToPlay],
      });

      expect(testEngine.asPlayerOne().isExerted(mickeyMouseTrumpeter)).toBe(true);
    });

    it("fails when Mickey Mouse is already exerted (drying does not apply once ready)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseTrumpeter, exerted: true }],
          hand: [characterToPlay],
          inkwell: 2,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter, {
        targets: [characterToPlay],
      });

      expect(result.success).toBe(false);
    });
  });
});
