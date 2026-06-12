import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bernardBrandnewAgent } from "./002-bernard-brand-new-agent";

const anotherCharacter = createMockCharacter({
  id: "another-char",
  name: "Another Character",
  cost: 1,
});

describe("Bernard - Brand-New Agent", () => {
  describe("I'LL CHECK IT OUT - At the end of your turn, if this character is exerted, you may ready another chosen character of yours.", () => {
    it("readies another chosen character when Bernard is exerted at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: bernardBrandnewAgent, exerted: true },
            { card: anotherCharacter, exerted: true },
          ],
          deck: 2,
        },
        { deck: 2 },
      );

      const anotherId = testEngine.findCardInstanceId(anotherCharacter, "play", "p1");

      // Pass turn to trigger end-of-turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Should have a bag effect (the optional trigger)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [anotherId] }),
      ).toBeSuccessfulCommand();

      // The other character should now be ready
      expect(testEngine.asPlayerOne().isExerted(anotherCharacter)).toBe(false);
      // Bernard should still be exerted
      expect(testEngine.asPlayerOne().isExerted(bernardBrandnewAgent)).toBe(true);
    });

    it("does not ready characters when Bernard is not exerted (condition checked at resolution)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bernardBrandnewAgent, { card: anotherCharacter, exerted: true }],
          deck: 2,
        },
        { deck: 2 },
      );

      // Bernard is ready (not exerted), pass turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // The bag effect is created (trigger fires at end of turn regardless)
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        // Resolve it - condition should fail since Bernard is not exerted
        testEngine.asPlayerOne().resolvePendingByCard(bernardBrandnewAgent, {
          resolveOptional: true,
        });
      }

      // Ally should still be exerted (ability didn't ready it because condition failed)
      expect(testEngine.asPlayerOne().isExerted(anotherCharacter)).toBe(true);
    });

    it("can decline the optional ready", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: bernardBrandnewAgent, exerted: true },
            { card: anotherCharacter, exerted: true },
          ],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // The other character should still be exerted
      expect(testEngine.asPlayerOne().isExerted(anotherCharacter)).toBe(true);
    });
  });
});
