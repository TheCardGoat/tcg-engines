import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { princeEricUrsulasGroom } from "./022-prince-eric-ursulas-groom";

const ursula = createMockCharacter({
  id: "ursula-test",
  name: "Ursula",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
});

const otherCharacter = createMockCharacter({
  id: "other-char-test",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Prince Eric - Ursula's Groom", () => {
  describe("UNDER VANESSA'S SPELL - While you have a character named Ursula in play, this character gains Bodyguard and gets +2 {W}", () => {
    it("does not have Bodyguard without Ursula in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [princeEricUrsulasGroom],
      });
      expect(testEngine.hasKeyword(princeEricUrsulasGroom, "Bodyguard")).toBe(false);
    });

    it("has normal willpower without Ursula in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [princeEricUrsulasGroom],
      });
      expect(testEngine.asPlayerOne().getCard(princeEricUrsulasGroom).willpower).toBe(
        princeEricUrsulasGroom.willpower,
      );
    });

    it("gains Bodyguard when Ursula is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [princeEricUrsulasGroom, ursula],
      });
      expect(testEngine.hasKeyword(princeEricUrsulasGroom, "Bodyguard")).toBe(true);
    });

    it("gets +2 willpower when Ursula is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [princeEricUrsulasGroom, ursula],
      });
      expect(testEngine.asPlayerOne().getCard(princeEricUrsulasGroom).willpower).toBe(
        princeEricUrsulasGroom.willpower + 2,
      );
    });

    it("does not gain Bodyguard from opponent's Ursula", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeEricUrsulasGroom],
          deck: 1,
        },
        {
          play: [ursula],
          deck: 1,
        },
      );
      expect(testEngine.hasKeyword(princeEricUrsulasGroom, "Bodyguard")).toBe(false);
    });

    it("does not get +2 willpower from opponent's Ursula", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeEricUrsulasGroom],
          deck: 1,
        },
        {
          play: [ursula],
          deck: 1,
        },
      );
      expect(testEngine.asPlayerOne().getCard(princeEricUrsulasGroom).willpower).toBe(
        princeEricUrsulasGroom.willpower,
      );
    });

    it("does not gain Bodyguard from a non-Ursula character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [princeEricUrsulasGroom, otherCharacter],
      });
      expect(testEngine.hasKeyword(princeEricUrsulasGroom, "Bodyguard")).toBe(false);
    });

    it("does not get +2 willpower from a non-Ursula character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [princeEricUrsulasGroom, otherCharacter],
      });
      expect(testEngine.asPlayerOne().getCard(princeEricUrsulasGroom).willpower).toBe(
        princeEricUrsulasGroom.willpower,
      );
    });
  });
});
