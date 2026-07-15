import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaScrappyCub } from "../characters";
import { luckyDime } from "./165-lucky-dime";

describe("Lucky Dime", () => {
  describe("NUMBER ONE — {E}, 2 {I} — Choose a character of yours and gain lore equal to their {L}.", () => {
    it("gains lore equal to the chosen character's lore value", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [luckyDime, simbaScrappyCub],
        inkwell: 2,
      });

      const result = testEngine.asPlayerOne().activateAbility(luckyDime, {
        ability: "NUMBER ONE",
        targets: [simbaScrappyCub],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(luckyDime)).toBe(true);
      // simbaScrappyCub has lore 3
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(simbaScrappyCub.lore);
    });

    it("requires 2 ink to activate", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [luckyDime, simbaScrappyCub],
        inkwell: 1,
      });

      const result = testEngine.asPlayerOne().activateAbility(luckyDime, {
        ability: "NUMBER ONE",
        targets: [simbaScrappyCub],
      });

      expect(result).not.toBeSuccessfulCommand();
    });
  });
});
