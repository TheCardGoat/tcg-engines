import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pegNaturalPerformer } from "./007-peg-natural-performer";

const filler = createMockCharacter({
  id: "peg-filler",
  name: "Filler Character",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const deckCard = createMockCharacter({
  id: "peg-deck-card",
  name: "Deck Card",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Peg - Natural Performer", () => {
  describe("CAPTIVE AUDIENCE {E} — If you have 3 or more other characters in play, draw a card.", () => {
    it("draws a card when there are at least 3 other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: pegNaturalPerformer, isDrying: false }, filler, filler, filler],
        hand: [],
        deck: [deckCard, deckCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(pegNaturalPerformer, "CAPTIVE AUDIENCE"),
      ).toBeSuccessfulCommand();

      // Peg should be exerted
      expect(testEngine.asPlayerOne().isExerted(pegNaturalPerformer)).toBe(true);

      // Player should have drawn 1 card
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });

    it("cannot activate when there are fewer than 3 other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: pegNaturalPerformer, isDrying: false }, filler, filler],
        hand: [],
        deck: [deckCard, deckCard],
      });

      const result = testEngine
        .asPlayerOne()
        .activateAbility(pegNaturalPerformer, "CAPTIVE AUDIENCE");
      expect(result.success).toBe(false);

      // Peg should NOT be exerted (ability did not activate)
      expect(testEngine.asPlayerOne().isExerted(pegNaturalPerformer)).toBe(false);

      // Player should NOT have drawn a card
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });
  });
});
