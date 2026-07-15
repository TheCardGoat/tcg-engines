import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { starkeyHooksHenchman } from "./191-starkey-hooks-henchman";
import { captainColonelsLieutenant } from "./106-captain-colonels-lieutenant";
import { johnSilverAlienPirate } from "./082-john-silver-alien-pirate";

const nonCaptainCharacter = createMockCharacter({
  id: "starkey-test-non-captain",
  name: "Random Pirate",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Pirate"],
});

describe("Starkey - Hook's Henchman", () => {
  describe("AYE AYE, CAPTAIN - While you have a Captain character in play, this character gets +1 lore.", () => {
    it("has base lore with no Captain in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [starkeyHooksHenchman],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardLore(starkeyHooksHenchman)).toBe(
        starkeyHooksHenchman.lore,
      );
    });

    it("does not get +1 lore with a non-Captain character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [starkeyHooksHenchman, nonCaptainCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardLore(starkeyHooksHenchman)).toBe(
        starkeyHooksHenchman.lore,
      );
    });

    it("gets +1 lore with Captain Colonel's Lieutenant in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [starkeyHooksHenchman, captainColonelsLieutenant],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardLore(starkeyHooksHenchman)).toBe(
        starkeyHooksHenchman.lore + 1,
      );
    });

    it("gets +1 lore with John Silver (Alien Pirate / Captain) in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [starkeyHooksHenchman, johnSilverAlienPirate],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardLore(starkeyHooksHenchman)).toBe(
        starkeyHooksHenchman.lore + 1,
      );
    });
  });
});
