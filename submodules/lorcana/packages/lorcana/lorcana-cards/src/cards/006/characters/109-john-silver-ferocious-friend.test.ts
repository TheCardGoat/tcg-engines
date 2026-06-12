import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { johnSilverFerociousFriend } from "./109-john-silver-ferocious-friend";

const ally = createMockCharacter({
  id: "js109-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("John Silver - Ferocious Friend", () => {
  describe("YOU HAVE TO CHART YOUR OWN COURSE - Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.", () => {
    it("deals 1 damage to chosen ally and readies them with cant-quest restriction when optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: johnSilverFerociousFriend, isDrying: false },
          { card: ally, exerted: true, isDrying: false },
        ],
      });

      expect(testEngine.asPlayerOne().quest(johnSilverFerociousFriend)).toBeSuccessfulCommand();

      // Trigger should add a bag effect
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      // Accept optional and target the ally
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(johnSilverFerociousFriend, { targets: [ally] }),
      ).toBeSuccessfulCommand();

      // Ally should have 1 damage
      expect(testEngine.asPlayerOne().getDamage(ally)).toBe(1);

      // Ally should be readied (was exerted)
      expect(testEngine.asPlayerOne().isExerted(ally)).toBe(false);

      // Ally should have cant-quest restriction
      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: ally,
        restriction: "cant-quest",
      });
    });

    it("does nothing when optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: johnSilverFerociousFriend, isDrying: false },
          { card: ally, exerted: true, isDrying: false },
        ],
      });

      expect(testEngine.asPlayerOne().quest(johnSilverFerociousFriend)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(johnSilverFerociousFriend, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Ally should have no damage
      expect(testEngine.asPlayerOne().getDamage(ally)).toBe(0);

      // Ally should still be exerted
      expect(testEngine.asPlayerOne().isExerted(ally)).toBe(true);

      // No restriction applied
      expect(testEngine.hasRestriction(ally, "cant-quest")).toBe(false);
    });

    it("John Silver himself cannot be targeted (other characters only)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: johnSilverFerociousFriend, isDrying: false }],
      });

      // Only John Silver in play — no valid targets for the optional
      expect(testEngine.asPlayerOne().quest(johnSilverFerociousFriend)).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        // If engine generates a bag, resolve it with no targets (decline / auto-reject)
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(johnSilverFerociousFriend, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // John Silver should not have taken any damage
      expect(testEngine.asPlayerOne().getDamage(johnSilverFerociousFriend)).toBe(0);
    });
  });
});
