import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { arielDeterminedMermaid } from "./196-ariel-determined-mermaid";

const testSong = createMockSong({
  id: "ariel-determined-mermaid-test-song",
  name: "Ariel Test Song",
  cost: 2,
  text: "A test song.",
});

const drawnCard = createMockCharacter({
  id: "ariel-determined-mermaid-drawn",
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
    it("draws a card, then lets you choose and discard a card when you play a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testSong, discardFodder],
        inkwell: testSong.cost,
        play: [arielDeterminedMermaid],
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielDeterminedMermaid),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [discardFodder],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 1,
        discard: 2,
      });
    });
  });
});
