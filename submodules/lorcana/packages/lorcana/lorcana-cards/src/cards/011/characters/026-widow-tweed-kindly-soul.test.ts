import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { widowTweedKindlySoul } from "./026-widow-tweed-kindly-soul";
import { todPlayfulKit } from "./090-tod-playful-kit";

const nonTodCharacter = createMockCharacter({
  id: "widow-tweed-non-tod",
  name: "Mickey Mouse",
  cost: 3,
  strength: 2,
  willpower: 3,
});

describe("Widow Tweed - Kindly Soul", () => {
  describe("I'VE GOT YOU - When you play this character, return a character card from your discard to your hand. If that character is named Tod, you may play him for free.", () => {
    it("triggers when Widow Tweed is played and creates a bag effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [widowTweedKindlySoul],
        inkwell: widowTweedKindlySoul.cost,
        discard: [nonTodCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(widowTweedKindlySoul)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(widowTweedKindlySoul)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("returns a non-Tod character from discard to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [widowTweedKindlySoul],
        inkwell: widowTweedKindlySoul.cost,
        discard: [nonTodCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(widowTweedKindlySoul)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(widowTweedKindlySoul, {
          targets: [nonTodCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Non-Tod character should be in hand
      expect(testEngine.asPlayerOne().getCardZone(nonTodCharacter)).toBe("hand");
      // No further bag effects — no free play offered for non-Tod
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not create a bag effect when discard is empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [widowTweedKindlySoul],
        inkwell: widowTweedKindlySoul.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(widowTweedKindlySoul)).toBeSuccessfulCommand();

      // No discard cards means ability should be suppressed
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not create a bag effect when only non-character cards are in discard", () => {
      const nonCharCard = createMockItem({
        id: "widow-tweed-item-mock",
        name: "Some Item",
        cost: 2,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [widowTweedKindlySoul],
        inkwell: widowTweedKindlySoul.cost,
        discard: [nonCharCard],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(widowTweedKindlySoul)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("returns Tod from discard and immediately plays him for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [widowTweedKindlySoul],
        inkwell: widowTweedKindlySoul.cost, // Only enough for Widow Tweed, not Tod
        discard: [todPlayfulKit],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(widowTweedKindlySoul)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      // Resolve the bag — targeting Tod in discard
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(widowTweedKindlySoul, {
          targets: [todPlayfulKit],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(todPlayfulKit)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
