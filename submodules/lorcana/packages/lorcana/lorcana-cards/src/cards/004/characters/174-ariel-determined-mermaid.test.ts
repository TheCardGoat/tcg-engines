import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { arielDeterminedMermaid } from "./174-ariel-determined-mermaid";

const testSong = createMockSong({
  id: "ariel-determined-mermaid-song",
  name: "Ariel Determined Mermaid Song",
  cost: 2,
  text: "A test song.",
});

const drawnCard = createMockCharacter({
  id: "ariel-determined-mermaid-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "ariel-determined-mermaid-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Ariel - Determined Mermaid", () => {
  describe("I WANT MORE - Whenever you play a song, you may draw a card, then choose and discard a card.", () => {
    it("draws a card before prompting you to discard a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [arielDeterminedMermaid, testSong, discardFodder],
        inkwell: arielDeterminedMermaid.cost + testSong.cost,
        play: [],
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(arielDeterminedMermaid)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielDeterminedMermaid),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);

      const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [discardFodderId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });
  });
});
