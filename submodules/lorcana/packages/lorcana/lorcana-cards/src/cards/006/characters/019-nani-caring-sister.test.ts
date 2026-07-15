import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { naniCaringSister } from "./019-nani-caring-sister";

const targetCharacter = createMockCharacter({
  id: "nani-test-target",
  name: "Target Character",
  cost: 2,
  strength: 4,
  willpower: 4,
});

describe("Nani - Caring Sister", () => {
  describe("Support keyword", () => {
    it("has Support keyword", () => {
      const supportAbility = naniCaringSister.abilities?.find(
        (a) => a.type === "keyword" && a.keyword === "Support",
      );
      expect(supportAbility).toBeDefined();
    });
  });

  describe("I AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.", () => {
    it("reduces chosen character's strength by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [naniCaringSister],
          inkwell: 10,
        },
        { play: [targetCharacter] },
      );

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(4);

      expect(
        testEngine.asPlayerOne().activateAbility(naniCaringSister, {
          ability: "I AM SO SORRY 2",
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(3);
    });

    it("costs 2 ink to activate", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [naniCaringSister],
          inkwell: 1,
        },
        { play: [targetCharacter] },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(naniCaringSister, {
          ability: "I AM SO SORRY 2",
          targets: [targetCharacter],
        }),
      ).not.toBeSuccessfulCommand();
    });

    it("strength reduction persists through opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [naniCaringSister], inkwell: 10, deck: 1 },
        { play: [targetCharacter], deck: 1 },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(naniCaringSister, {
          ability: "I AM SO SORRY 2",
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(3);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(3);
    });
  });
});
