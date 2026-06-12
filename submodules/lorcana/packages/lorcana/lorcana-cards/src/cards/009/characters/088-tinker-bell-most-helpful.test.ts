import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { tinkerBellMostHelpful } from "./088-tinker-bell-most-helpful";

const target = createMockCharacter({
  id: "tinker-bell-most-helpful-target",
  name: "Test Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "tinker-bell-most-helpful-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Tinker Bell - Most Helpful", () => {
  it("should have Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [tinkerBellMostHelpful],
      deck: 3,
    });

    expect(testEngine.hasKeyword(tinkerBellMostHelpful, "Evasive")).toBe(true);
  });

  describe("PIXIE DUST — When you play this character, chosen character gains Evasive this turn.", () => {
    it("chosen character gains Evasive this turn when Tinker Bell is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tinkerBellMostHelpful],
        play: [target],
        inkwell: tinkerBellMostHelpful.cost,
        deck: 3,
      });

      expect(testEngine.hasKeyword(target, "Evasive")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(tinkerBellMostHelpful)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const targetId = testEngine.findCardInstanceId(target, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tinkerBellMostHelpful, {
          targets: [targetId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(target, "Evasive")).toBe(true);
    });

    it("chosen character can also be an opponent's character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellMostHelpful],
          inkwell: tinkerBellMostHelpful.cost,
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(opponentCharacter, "Evasive")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(tinkerBellMostHelpful)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const targetId = testEngine.findCardInstanceId(opponentCharacter, "play", PLAYER_TWO);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tinkerBellMostHelpful, {
          targets: [targetId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().hasKeyword(opponentCharacter, "Evasive")).toBe(true);
    });

    it("Evasive expires at the end of the current turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellMostHelpful],
          play: [target],
          inkwell: tinkerBellMostHelpful.cost,
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().playCard(tinkerBellMostHelpful)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      const targetId = testEngine.findCardInstanceId(target, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tinkerBellMostHelpful, {
          targets: [targetId],
        }),
      ).toBeSuccessfulCommand();

      // Evasive is active during player one's turn
      expect(testEngine.hasKeyword(target, "Evasive")).toBe(true);

      // After passing to player two's turn, Evasive should have expired
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(target, "Evasive")).toBe(false);
    });

    it("Tinker Bell herself can be chosen as the target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tinkerBellMostHelpful],
        inkwell: tinkerBellMostHelpful.cost,
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(tinkerBellMostHelpful)).toBeSuccessfulCommand();

      // Tinker Bell is in play and is a valid target
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      // Choose Tinker Bell herself — she already has native Evasive, so it remains true
      const tinkerBellId = testEngine.findCardInstanceId(tinkerBellMostHelpful, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tinkerBellMostHelpful, {
          targets: [tinkerBellId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(tinkerBellMostHelpful, "Evasive")).toBe(true);
    });
  });
});
