import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { olafCarrotEnthusiast } from "./149-olaf-carrot-enthusiast";

const allyA = createMockCharacter({
  id: "olaf-test-ally-a",
  name: "Ally A",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const allyB = createMockCharacter({
  id: "olaf-test-ally-b",
  name: "Ally B",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Olaf - Carrot Enthusiast", () => {
  describe("CARROTS ALL AROUND! - Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.", () => {
    it("gives each other character +strength equal to Olaf's strength when he quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: olafCarrotEnthusiast, isDrying: false }, allyA, allyB],
        deck: 2,
      });

      // Before questing, allies should have their base strength
      expect(testEngine.asPlayerOne().getCardStrength(allyA)).toBe(allyA.strength);
      expect(testEngine.asPlayerOne().getCardStrength(allyB)).toBe(allyB.strength);

      // Quest with Olaf
      expect(testEngine.asPlayerOne().quest(olafCarrotEnthusiast)).toBeSuccessfulCommand();

      // Resolve the optional ability (accept it)
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(olafCarrotEnthusiast, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // After resolving, each other character should have +1 strength (Olaf's strength is 1)
      expect(testEngine.asPlayerOne().getCardStrength(allyA)).toBe(
        allyA.strength + olafCarrotEnthusiast.strength,
      );
      expect(testEngine.asPlayerOne().getCardStrength(allyB)).toBe(
        allyB.strength + olafCarrotEnthusiast.strength,
      );
    });

    it("is optional - can decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: olafCarrotEnthusiast, isDrying: false }, allyA],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(olafCarrotEnthusiast)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(olafCarrotEnthusiast, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Strength should remain at base
      expect(testEngine.asPlayerOne().getCardStrength(allyA)).toBe(allyA.strength);
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: olafCarrotEnthusiast, isDrying: false }, allyA],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(olafCarrotEnthusiast)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(olafCarrotEnthusiast, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Bonus active
      expect(testEngine.asPlayerOne().getCardStrength(allyA)).toBe(
        allyA.strength + olafCarrotEnthusiast.strength,
      );

      // Pass the turn - bonus should expire
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(allyA)).toBe(allyA.strength);
    });

    it("does not buff Olaf himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: olafCarrotEnthusiast, isDrying: false }, allyA],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(olafCarrotEnthusiast)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(olafCarrotEnthusiast, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Olaf should still have his base strength
      expect(testEngine.asPlayerOne().getCardStrength(olafCarrotEnthusiast)).toBe(
        olafCarrotEnthusiast.strength,
      );
    });
  });
});
