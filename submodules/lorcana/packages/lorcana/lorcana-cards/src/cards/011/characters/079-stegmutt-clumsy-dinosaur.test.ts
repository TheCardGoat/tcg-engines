import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { stegmuttClumsyDinosaur } from "./079-stegmutt-clumsy-dinosaur";

function makeItems(count: number, prefix: string) {
  return Array.from({ length: count }, (_, i) =>
    createMockItem({ id: `stegmutt-${prefix}-${i}`, name: `${prefix} Item ${i}`, cost: 1 }),
  );
}

describe("Stegmutt - Clumsy Dinosaur", () => {
  describe("WAKE OF DESTRUCTION - For each item card in your discard, you pay 1 {I} less to play this character", () => {
    it("should reduce cost by 1 for each item in discard", () => {
      const items = makeItems(3, "reduce");
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [stegmuttClumsyDinosaur],
        discard: items,
        inkwell: 5, // Cost 8 - 3 items = 5
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(stegmuttClumsyDinosaur)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(stegmuttClumsyDinosaur)).toBe("play");
    });

    it("should be playable for free with 8+ items in discard", () => {
      const items = makeItems(8, "free");
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [stegmuttClumsyDinosaur],
        discard: items,
        inkwell: 0,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(stegmuttClumsyDinosaur)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(stegmuttClumsyDinosaur)).toBe("play");
    });

    it("should have full cost with no items in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [stegmuttClumsyDinosaur],
        inkwell: 7,
        deck: 5,
      });

      const result = testEngine.asPlayerOne().playCard(stegmuttClumsyDinosaur);
      expect(result.success).toBe(false);
    });
  });

  describe("COLLATERAL DAMAGE - When you play this character, you may put 3 item cards from your discard on the bottom of your deck in any order. If you do, deal 3 damage to chosen character.", () => {
    it("should deal 3 damage when putting 3 items on bottom of deck", () => {
      const items = makeItems(3, "dmg");
      const target = createMockCharacter({
        id: "stegmutt-dmg-target",
        name: "Damage Target",
        cost: 3,
        strength: 2,
        willpower: 10,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [stegmuttClumsyDinosaur],
          discard: items,
          inkwell: 5, // Cost 8 - 3 items = 5
          deck: 5,
        },
        {
          play: [target],
        },
      );

      expect(testEngine.asPlayerOne().playCard(stegmuttClumsyDinosaur)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const bagId = bagEffects[0]!.id;

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(stegmuttClumsyDinosaur, {
          targets: [...items, target],
        }),
      ).toBeSuccessfulCommand();

      // All 3 items should be moved to bottom of deck
      for (const item of items) {
        expect(testEngine.asPlayerOne().getCardZone(item)).toBe("deck");
      }

      // Target should have 3 damage
      expect(testEngine.asPlayerTwo().getDamage(target)).toBe(3);
    });

    it("should be optional - can decline the ability", () => {
      const items = makeItems(3, "opt");
      const optTarget = createMockCharacter({
        id: "stegmutt-opt-target",
        name: "Optional Target",
        cost: 3,
        strength: 2,
        willpower: 5,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [stegmuttClumsyDinosaur],
          discard: items,
          inkwell: 5,
          deck: 5,
        },
        {
          play: [optTarget],
        },
      );

      expect(testEngine.asPlayerOne().playCard(stegmuttClumsyDinosaur)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        const bagId = bagEffects[0]!.id;
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(stegmuttClumsyDinosaur, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerTwo().getDamage(optTarget)).toBe(0);
    });

    it("should be optional and declinable when fewer than 3 items in discard", () => {
      const items = makeItems(2, "few");
      const target = createMockCharacter({
        id: "stegmutt-few-target",
        name: "Few Target",
        cost: 3,
        strength: 2,
        willpower: 10,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [stegmuttClumsyDinosaur],
          discard: items,
          inkwell: 6, // Cost 8 - 2 items = 6
          deck: 5,
        },
        {
          play: [target],
        },
      );

      expect(testEngine.asPlayerOne().playCard(stegmuttClumsyDinosaur)).toBeSuccessfulCommand();

      // The optional ability triggers but player must decline since they cannot put 3 items
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        const bagId = bagEffects[0]!.id;
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(stegmuttClumsyDinosaur, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // Items remain in discard, no damage dealt
      for (const item of items) {
        expect(testEngine.asPlayerOne().getCardZone(item)).toBe("discard");
      }
      expect(testEngine.asPlayerTwo().getDamage(target)).toBe(0);
    });
  });
});
