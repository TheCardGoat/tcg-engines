import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { magicaDeSpellTheMidasTouch } from "./049-magica-de-spell-the-midas-touch";

const cheapItem = createMockItem({
  id: "magica-cheap-item",
  name: "Cheap Item",
  cost: 2,
});

const expensiveItem = createMockItem({
  id: "magica-expensive-item",
  name: "Expensive Item",
  cost: 5,
});

describe("Magica De Spell - The Midas Touch", () => {
  describe("ALL MINE - Whenever this character quests, gain lore equal to the cost of one of your items in play.", () => {
    it("gains lore equal to the cost of one item when questing with a single item in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: magicaDeSpellTheMidasTouch, isDrying: false }, cheapItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(magicaDeSpellTheMidasTouch)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicaDeSpellTheMidasTouch, {
          targets: [cheapItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(cheapItem.cost);
    });

    it("gains lore equal to the chosen item's cost when multiple items are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: magicaDeSpellTheMidasTouch, isDrying: false }, cheapItem, expensiveItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(magicaDeSpellTheMidasTouch)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const bagEffect = bagEffects[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicaDeSpellTheMidasTouch, {
          targets: [expensiveItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(expensiveItem.cost);
    });

    it("gains lore equal to the cheaper item when choosing the cheap item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: magicaDeSpellTheMidasTouch, isDrying: false }, cheapItem, expensiveItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(magicaDeSpellTheMidasTouch)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const bagEffect = bagEffects[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicaDeSpellTheMidasTouch, {
          targets: [cheapItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(cheapItem.cost);
    });

    it("gains no lore when no items are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: magicaDeSpellTheMidasTouch, isDrying: false }],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(magicaDeSpellTheMidasTouch)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
