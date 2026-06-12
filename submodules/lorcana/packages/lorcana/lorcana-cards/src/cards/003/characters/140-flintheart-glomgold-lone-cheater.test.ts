import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { flintheartGlomgoldLoneCheater } from "./140-flintheart-glomgold-lone-cheater";

const nonEvasiveAttacker = createMockCharacter({
  id: "flintheart-glomgold-lone-cheater-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "flintheart-glomgold-lone-cheater-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "flintheart-glomgold-lone-cheater-evasive-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Flintheart Glomgold - Lone Cheater", () => {
  describe("THEY'LL NEVER SEE IT COMING! — During your turn, this character gains Evasive.", () => {
    it("gains Evasive during your turn and loses it after you pass the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: flintheartGlomgoldLoneCheater, exerted: true }],
          deck: 1,
        },
        {
          play: [nonEvasiveAttacker, evasiveAttacker],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(flintheartGlomgoldLoneCheater, "Evasive")).toBe(
        true,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(flintheartGlomgoldLoneCheater, "Evasive")).toBe(
        false,
      );
      expect(
        testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, flintheartGlomgoldLoneCheater),
      ).toBe(true);
      expect(
        testEngine.asPlayerTwo().canChallenge(evasiveAttacker, flintheartGlomgoldLoneCheater),
      ).toBe(true);
    });
  });
});
