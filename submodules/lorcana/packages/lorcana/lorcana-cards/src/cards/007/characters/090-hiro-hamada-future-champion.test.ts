import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { baymaxGiantRobot } from "./104-baymax-giant-robot";
import { hiroHamadaFutureChampion } from "./090-hiro-hamada-future-champion";

const otherShiftBase = createMockCharacter({
  id: "hiro-other-shift-base",
  name: "Other Shift Base",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const deckCard = createMockCharacter({
  id: "hiro-deck-card",
  name: "Deck Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Hiro Hamada - Future Champion", () => {
  describe("ORIGIN STORY - When you play a Floodborn character on this card, draw a card.", () => {
    it("does not trigger when a Floodborn character is shifted onto another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hiroHamadaFutureChampion, otherShiftBase],
        hand: [baymaxGiantRobot],
        inkwell: 4,
        deck: [deckCard],
      });
      const otherShiftBaseId = testEngine.findCardInstanceId(otherShiftBase, "play", "player_one");

      expect(
        testEngine.asPlayerOne().playCard(baymaxGiantRobot, {
          cost: { cost: "shift", shiftTarget: otherShiftBaseId },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
    });

    it("triggers when a Floodborn character is shifted onto Hiro", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hiroHamadaFutureChampion],
        hand: [baymaxGiantRobot],
        inkwell: 4,
        deck: [deckCard],
      });
      const hiroId = testEngine.findCardInstanceId(hiroHamadaFutureChampion, "play", "player_one");

      expect(
        testEngine.asPlayerOne().playCard(baymaxGiantRobot, {
          cost: { cost: "shift", shiftTarget: hiroId },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(2);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(hiroHamadaFutureChampion),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("hand");
    });
  });
});
