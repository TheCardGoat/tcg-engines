import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { akelaForestRunner } from "./090-akela-forest-runner";

describe("Akela - Forest Runner", () => {
  describe("AHEAD OF THE PACK - 1 {I} -- This character gets +1 {S} this turn.", () => {
    it("should gain +1 strength this turn when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [akelaForestRunner],
        inkwell: 1,
        deck: 2,
      });

      const akelaBefore = testEngine.asPlayerOne().getCard(akelaForestRunner);
      expect(akelaBefore.strength).toBe(akelaForestRunner.strength);

      expect(
        testEngine.asPlayerOne().activateAbility(akelaForestRunner, {
          ability: "AHEAD OF THE PACK",
        }),
      ).toBeSuccessfulCommand();

      const akelaAfter = testEngine.asPlayerOne().getCard(akelaForestRunner);
      expect(akelaAfter.strength).toBe(akelaForestRunner.strength + 1);
    });

    it("should not be activatable without enough ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [akelaForestRunner],
        inkwell: 0,
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(akelaForestRunner, {
          ability: "AHEAD OF THE PACK",
        }),
      ).not.toBeSuccessfulCommand();

      const akela = testEngine.asPlayerOne().getCard(akelaForestRunner);
      expect(akela.strength).toBe(akelaForestRunner.strength);
    });

    it("should stack when activated multiple times", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [akelaForestRunner],
        inkwell: 3,
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(akelaForestRunner, {
          ability: "AHEAD OF THE PACK",
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(akelaForestRunner).strength).toBe(
        akelaForestRunner.strength + 1,
      );

      expect(
        testEngine.asPlayerOne().activateAbility(akelaForestRunner, {
          ability: "AHEAD OF THE PACK",
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(akelaForestRunner).strength).toBe(
        akelaForestRunner.strength + 2,
      );

      expect(
        testEngine.asPlayerOne().activateAbility(akelaForestRunner, {
          ability: "AHEAD OF THE PACK",
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(akelaForestRunner).strength).toBe(
        akelaForestRunner.strength + 3,
      );
    });

    it("should lose the strength bonus at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [akelaForestRunner],
          inkwell: 1,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(akelaForestRunner, {
          ability: "AHEAD OF THE PACK",
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(akelaForestRunner).strength).toBe(
        akelaForestRunner.strength + 1,
      );

      // Pass turn - strength bonus should expire
      testEngine.asPlayerOne().passTurn();

      expect(testEngine.asPlayerOne().getCard(akelaForestRunner).strength).toBe(
        akelaForestRunner.strength,
      );
    });

    it("should be activatable even when exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: akelaForestRunner, exerted: true }],
        inkwell: 1,
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(akelaForestRunner, {
          ability: "AHEAD OF THE PACK",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(akelaForestRunner).strength).toBe(
        akelaForestRunner.strength + 1,
      );
    });
  });
});
