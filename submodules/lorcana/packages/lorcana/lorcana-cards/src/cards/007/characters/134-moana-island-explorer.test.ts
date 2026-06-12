import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { moanaIslandExplorer } from "./134-moana-island-explorer";

const defender = createMockCharacter({
  id: "moana-ie-defender",
  name: "Defender",
  cost: 2,
  strength: 1,
  willpower: 10,
});

const allyCharacter = createMockCharacter({
  id: "moana-ie-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Moana - Island Explorer", () => {
  describe("Evasive", () => {
    it("has Evasive keyword", () => {
      const abilities = moanaIslandExplorer.abilities ?? [];
      const evasive = abilities.find((a) => a.type === "keyword" && a.keyword === "Evasive");
      expect(evasive).toBeDefined();
    });
  });

  describe("ADVENTUROUS SPIRIT - Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.", () => {
    it("gives +3 strength to another chosen character of yours when challenging", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: moanaIslandExplorer, isDrying: false },
            { card: allyCharacter, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: defender, exerted: true, isDrying: false }],
          deck: 1,
        },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(allyCharacter);
      expect(strengthBefore).toBe(2);

      expect(
        testEngine.asPlayerOne().challenge(moanaIslandExplorer, defender),
      ).toBeSuccessfulCommand();

      // Resolve the triggered ability - choose ally character for +3 strength
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(5);
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: moanaIslandExplorer, isDrying: false },
            { card: allyCharacter, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: defender, exerted: true, isDrying: false }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(moanaIslandExplorer, defender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(5);

      // Pass both turns
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Strength should be back to normal
      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(2);
    });

    it("cannot target Moana herself (another character)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: moanaIslandExplorer, isDrying: false },
            { card: allyCharacter, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: defender, exerted: true, isDrying: false }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(moanaIslandExplorer, defender),
      ).toBeSuccessfulCommand();

      // Trying to target Moana herself should fail
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [moanaIslandExplorer] }),
      ).not.toBeSuccessfulCommand();
    });

    it("cannot target opponent's character (of yours)", () => {
      const opponentCharacter = createMockCharacter({
        id: "moana-ie-opp-char",
        name: "Opponent Char",
        cost: 2,
        strength: 3,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: moanaIslandExplorer, isDrying: false },
            { card: allyCharacter, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [
            { card: defender, exerted: true, isDrying: false },
            { card: opponentCharacter, isDrying: false },
          ],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(moanaIslandExplorer, defender),
      ).toBeSuccessfulCommand();

      // Trying to target opponent's character should fail
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [opponentCharacter] }),
      ).not.toBeSuccessfulCommand();
    });
  });
});
