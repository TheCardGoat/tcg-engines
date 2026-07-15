import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lythosRockTitan } from "./180-lythos-rock-titan";

const targetCharacter = createMockCharacter({
  id: "lythos-test-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opponentCharacter = createMockCharacter({
  id: "lythos-test-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Lythos - Rock Titan", () => {
  describe("Resist +2", () => {
    it("has Resist +2 as a static keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lythosRockTitan],
      });

      expect(testEngine.asPlayerOne().hasKeyword(lythosRockTitan, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(lythosRockTitan, "Resist")).toBe(2);
    });
  });

  describe("STONE SKIN - {E} — Chosen character gains Resist +2 this turn.", () => {
    it("grants Resist +2 to chosen character for this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lythosRockTitan, targetCharacter],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(lythosRockTitan, {
          ability: "STONE SKIN",
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(targetCharacter, "Resist")).toBe(2);
    });

    it("exerts Lythos when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lythosRockTitan, targetCharacter],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(lythosRockTitan, {
          ability: "STONE SKIN",
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(lythosRockTitan)).toBe(true);
    });

    it("can target opponent's characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [lythosRockTitan],
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(lythosRockTitan, {
          ability: "STONE SKIN",
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().hasKeyword(opponentCharacter, "Resist")).toBe(true);
      expect(testEngine.asPlayerTwo().getKeywordValue(opponentCharacter, "Resist")).toBe(2);
    });

    it("granted Resist +2 lasts until end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [lythosRockTitan, targetCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(lythosRockTitan, {
          ability: "STONE SKIN",
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Resist")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Resist")).toBe(false);
    });

    it("can target itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lythosRockTitan],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(lythosRockTitan, {
          ability: "STONE SKIN",
          targets: [lythosRockTitan],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(lythosRockTitan, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(lythosRockTitan, "Resist")).toBe(4);
    });
  });
});
