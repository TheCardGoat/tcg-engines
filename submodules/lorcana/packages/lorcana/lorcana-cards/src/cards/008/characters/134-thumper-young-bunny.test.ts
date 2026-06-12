import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { thumperYoungBunny } from "./134-thumper-young-bunny";

const target = createMockCharacter({
  id: "thumper-yb-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Thumper - Young Bunny", () => {
  describe("YOU CAN DO IT! {E} — Chosen character gets +3 this turn.", () => {
    it("exerts Thumper and gives chosen character +3 strength this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: thumperYoungBunny, isDrying: false }, target],
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(target);

      expect(
        testEngine.asPlayerOne().activateAbility(thumperYoungBunny, {
          ability: "YOU CAN DO IT!",
          targets: [target],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(thumperYoungBunny)).toBe(true);
      expect(testEngine.asPlayerOne().getCardStrength(target)).toBe(strengthBefore + 3);
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: thumperYoungBunny, isDrying: false }, target],
        },
        {
          deck: 5,
        },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(target);

      expect(
        testEngine.asPlayerOne().activateAbility(thumperYoungBunny, {
          ability: "YOU CAN DO IT!",
          targets: [target],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(target)).toBe(strengthBefore + 3);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(target)).toBe(strengthBefore);
    });

    it("cannot activate when already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: thumperYoungBunny, exerted: true, isDrying: false }, target],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(thumperYoungBunny, {
          ability: "YOU CAN DO IT!",
          targets: [target],
        }),
      ).not.toBeSuccessfulCommand();
    });
  });
});
