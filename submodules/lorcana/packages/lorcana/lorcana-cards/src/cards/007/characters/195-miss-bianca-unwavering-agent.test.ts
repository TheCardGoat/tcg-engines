import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { missBiancaUnwaveringAgent } from "./195-miss-bianca-unwavering-agent";

const allyCharacter = createMockCharacter({
  id: "miss-bianca-ally",
  name: "Ally Friend",
  cost: 2,
  classifications: ["Storyborn", "Ally"],
});

const nonAllyCharacter = createMockCharacter({
  id: "miss-bianca-non-ally",
  name: "Non-Ally Friend",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Miss Bianca - Unwavering Agent", () => {
  describe("HAVE A LITTLE FAITH - If you have an Ally character in play, you pay 2 {I} less to play this character.", () => {
    it("costs 2 less to play when you have an Ally character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 4,
        play: [allyCharacter],
        hand: [missBiancaUnwaveringAgent],
      });

      // Card costs 6, with Ally in play it should cost 4
      expect(testEngine.asPlayerOne().playCard(missBiancaUnwaveringAgent)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(missBiancaUnwaveringAgent)).toBe("play");
    });

    it("cannot be played with reduced cost if not enough ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        play: [allyCharacter],
        hand: [missBiancaUnwaveringAgent],
      });

      // Card costs 6, with Ally it costs 4, but only 3 ink available
      expect(testEngine.asPlayerOne().playCard(missBiancaUnwaveringAgent).success).toBe(false);
    });

    it("costs full price when no Ally character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 5,
        play: [nonAllyCharacter],
        hand: [missBiancaUnwaveringAgent],
      });

      // Card costs 6, no Ally so no discount, 5 ink is not enough
      expect(testEngine.asPlayerOne().playCard(missBiancaUnwaveringAgent).success).toBe(false);
    });

    it("can be played at full cost when no Ally is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 6,
        hand: [missBiancaUnwaveringAgent],
      });

      expect(testEngine.asPlayerOne().playCard(missBiancaUnwaveringAgent)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(missBiancaUnwaveringAgent)).toBe("play");
    });
  });
});
