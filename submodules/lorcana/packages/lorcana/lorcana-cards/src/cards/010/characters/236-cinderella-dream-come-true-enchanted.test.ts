import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cinderellaDreamComeTrueEnchanted } from "./236-cinderella-dream-come-true-enchanted";

const princessCharacter = createMockCharacter({
  id: "cinderella-princess",
  name: "Princess Ally",
  cost: 2,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const inkFodder = createMockCharacter({
  id: "cinderella-ink-fodder",
  name: "Ink Fodder",
  cost: 1,
});

const drawnCard = createMockCharacter({
  id: "cinderella-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Cinderella - Dream Come True (Enchanted)", () => {
  describe("WHATEVER YOU WISH FOR - At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.", () => {
    it("puts a card from your hand into your inkwell facedown and draws a card when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [princessCharacter, inkFodder],
        play: [cinderellaDreamComeTrueEnchanted],
        inkwell: princessCharacter.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(princessCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(cinderellaDreamComeTrueEnchanted),
      ).toBeSuccessfulCommand();

      // Accepting creates a pending target selection: which hand card to put in inkwell
      const inkFodderId = testEngine.findCardInstanceId(inkFodder, "hand", "p1");
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [inkFodderId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(inkFodder)).toBe("inkwell");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
        expect.objectContaining({
          hand: 1,
          play: 2,
          deck: 0,
          inkwell: princessCharacter.cost + 1,
        }),
      );
    });

    it("can be declined without moving a card into the inkwell or drawing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [princessCharacter, inkFodder],
        play: [cinderellaDreamComeTrueEnchanted],
        inkwell: princessCharacter.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(princessCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(cinderellaDreamComeTrueEnchanted, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(inkFodder)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
        expect.objectContaining({
          hand: 1,
          play: 2,
          deck: 1,
          inkwell: princessCharacter.cost,
        }),
      );
    });
  });
});
