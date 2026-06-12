import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { theQueenFairestOfAll } from "./144-the-queen-fairest-of-all";
import { theQueenCrownOfTheCouncil } from "./148-the-queen-crown-of-the-council";
import { theQueenCruelestOfAll } from "./139-the-queen-cruelest-of-all";

describe("The Queen - Fairest of All", () => {
  describe("REFLECTIONS OF VANITY - For each other character named The Queen you have in play, this character gets +1 {L}.", () => {
    it("gains +1 lore for each other The Queen character in play (2 others = +2 lore)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theQueenFairestOfAll, theQueenCrownOfTheCouncil, theQueenCruelestOfAll],
      });

      const card = testEngine.asPlayerOne().getCard(theQueenFairestOfAll);
      expect(card.lore).toBe(theQueenFairestOfAll.lore + 2);
    });

    it("gains no bonus lore when no other The Queen characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theQueenFairestOfAll],
      });

      const card = testEngine.asPlayerOne().getCard(theQueenFairestOfAll);
      expect(card.lore).toBe(theQueenFairestOfAll.lore);
    });
  });
});
