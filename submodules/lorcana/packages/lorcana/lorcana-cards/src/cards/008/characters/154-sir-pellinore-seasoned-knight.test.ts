import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sirPellinoreSeasonedKnight } from "./154-sir-pellinore-seasoned-knight";

const allyCharacter = createMockCharacter({
  id: "sir-pellinore-ally-character",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
});

const anotherAlly = createMockCharacter({
  id: "sir-pellinore-another-ally",
  name: "Another Ally Character",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
});

describe("Sir Pellinore - Seasoned Knight", () => {
  describe("CODE OF HONOR — Whenever this character quests, your other characters gain Support this turn.", () => {
    it("grants Support to other characters in play when Sir Pellinore quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: sirPellinoreSeasonedKnight, isDrying: false }, allyCharacter, anotherAlly],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCard(allyCharacter)?.hasSupport).toBe(false);
      expect(testEngine.asPlayerOne().getCard(anotherAlly)?.hasSupport).toBe(false);

      expect(testEngine.asPlayerOne().quest(sirPellinoreSeasonedKnight)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(allyCharacter)?.hasSupport).toBe(true);
      expect(testEngine.asPlayerOne().getCard(anotherAlly)?.hasSupport).toBe(true);
    });

    it("Support gained from CODE OF HONOR expires at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: sirPellinoreSeasonedKnight, isDrying: false }, allyCharacter],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().getCard(allyCharacter)?.hasSupport).toBe(false);

      expect(testEngine.asPlayerOne().quest(sirPellinoreSeasonedKnight)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(allyCharacter)?.hasSupport).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(allyCharacter)?.hasSupport).toBe(false);
    });
  });
});
