import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sneezyStartlinglyLoud } from "./042-sneezy-startlingly-loud";

const allyCharacter = createMockCharacter({
  id: "sneezy-ally-target",
  name: "Ally Target",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Sneezy - Startlingly Loud", () => {
  describe("Gesundheit - When you play this character, chosen character gets +1 {L} this turn.", () => {
    it("triggers when played and creates a bag effect for target selection", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [sneezyStartlinglyLoud],
        inkwell: sneezyStartlinglyLoud.cost,
        play: [allyCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(sneezyStartlinglyLoud)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(sneezyStartlinglyLoud)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("gives +1 lore to chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [sneezyStartlinglyLoud],
        inkwell: sneezyStartlinglyLoud.cost,
        play: [allyCharacter],
        deck: 5,
      });

      const initialLore = testEngine.asPlayerOne().getCardLore(allyCharacter);

      expect(testEngine.asPlayerOne().playCard(sneezyStartlinglyLoud)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(sneezyStartlinglyLoud, { targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(allyCharacter)).toBe(initialLore + 1);
    });

    it("lore bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sneezyStartlinglyLoud],
          inkwell: sneezyStartlinglyLoud.cost,
          play: [allyCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const initialLore = testEngine.asPlayerOne().getCardLore(allyCharacter);

      expect(testEngine.asPlayerOne().playCard(sneezyStartlinglyLoud)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(sneezyStartlinglyLoud, { targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(allyCharacter)).toBe(initialLore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(allyCharacter)).toBe(initialLore);
    });

    it("can target Sneezy himself with the lore boost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [sneezyStartlinglyLoud],
        inkwell: sneezyStartlinglyLoud.cost,
        deck: 5,
      });

      const initialLore = sneezyStartlinglyLoud.lore;

      expect(testEngine.asPlayerOne().playCard(sneezyStartlinglyLoud)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sneezyStartlinglyLoud, {
          targets: [sneezyStartlinglyLoud],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(sneezyStartlinglyLoud)).toBe(initialLore + 1);
    });
  });
});
