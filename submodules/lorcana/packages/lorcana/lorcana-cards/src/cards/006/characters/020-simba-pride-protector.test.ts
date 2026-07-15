import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mauiHeroToAll } from "../../001/characters/114-maui-hero-to-all";
import { aladdinCorneredSwordsman } from "../../001/characters/171-aladdin-cornered-swordsman";
import { simbaPrideProtector } from "./020-simba-pride-protector";

const allyCharacter = createMockCharacter({
  id: "simba-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const anotherAlly = createMockCharacter({
  id: "simba-test-another-ally",
  name: "Another Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Simba - Pride Protector", () => {
  it("has Shift 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [simbaPrideProtector],
    });

    expect(testEngine.hasKeyword(simbaPrideProtector, "Shift")).toBe(true);
  });

  describe("UNDERSTAND THE BALANCE - At the end of your turn, if this character is exerted, you may ready your other characters.", () => {
    it("readies other characters when Simba is exerted at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: simbaPrideProtector, exerted: true },
            { card: allyCharacter, exerted: true },
            { card: anotherAlly, exerted: true },
          ],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Pass turn to trigger end-of-turn effect
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Should have a bag effect for the triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve the bag effect (accept the optional ability)
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaPrideProtector, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Other characters should be readied
      expect(testEngine.asPlayerOne().isExerted(allyCharacter)).toBe(false);
      expect(testEngine.asPlayerOne().isExerted(anotherAlly)).toBe(false);

      // Simba should still be exerted (readies OTHER characters, not self)
      expect(testEngine.asPlayerOne().isExerted(simbaPrideProtector)).toBe(true);
    });

    it("does not ready characters when Simba is not exerted (conditional check at resolution)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [simbaPrideProtector, { card: allyCharacter, exerted: true }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Pass turn - trigger fires unconditionally, condition checked at resolution
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // The bag effect is created (trigger fires at end of turn regardless)
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        // Resolve it - the conditional check should fail since Simba is not exerted
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(simbaPrideProtector, { resolveOptional: true });
      }

      // Ally should still be exerted (ability didn't ready it because condition failed)
      expect(testEngine.asPlayerOne().isExerted(allyCharacter)).toBe(true);
    });
  });

  // Rule 6.2.4: Secondary conditions are checked only when the effect resolves.
  // FAQ: "If I use another effect to ready Simba, can I still ready other characters
  // with Understand the Balance? No. If Simba is not exerted when you resolve
  // Understand the Balance, it will resolve to no effect."
  describe("Secondary condition (rule 6.2.4)", () => {
    it("resolves with no effect if Simba is readied by another effect before resolution", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: simbaPrideProtector, exerted: true },
            { card: allyCharacter, exerted: true },
          ],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Pass turn - Simba's end-of-turn trigger fires (Simba is exerted)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Simulate another effect readying Simba before the bag resolves
      const simbaId = testEngine.findCardInstanceId(simbaPrideProtector, "play", PLAYER_ONE);
      testEngine.asServer().manualReadyCard(simbaId);
      expect(testEngine.asPlayerOne().isExerted(simbaPrideProtector)).toBe(false);

      // Resolve the bag effect - secondary condition "if this character is exerted"
      // is now false, so the ability should resolve with no effect
      testEngine.asPlayerOne().resolvePendingByCard(simbaPrideProtector, { resolveOptional: true });

      // Ally should still be exerted (ability had no effect)
      expect(testEngine.asPlayerOne().isExerted(allyCharacter)).toBe(true);
    });
  });

  describe("Regression", () => {
    // Player bug report: Simba triggered at the opponent's end-of-turn. The
    // trigger is `on: "YOU"`, so when the opponent ends their turn, no bag
    // entry should be created for Simba.
    it("does not trigger at opponent's end-of-turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
        },
        {
          play: [
            { card: simbaPrideProtector, exerted: true },
            { card: allyCharacter, exerted: true },
          ],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("untapping a Reckless character should not force a challenge again", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: simbaPrideProtector, exerted: true }, mauiHeroToAll],
          deck: 2,
        },
        {
          play: [{ card: aladdinCorneredSwordsman, exerted: true }],
          deck: 2,
        },
      );

      // Maui (Rush + Reckless) challenges Aladdin
      expect(
        testEngine.asPlayerOne().challenge(mauiHeroToAll, aladdinCorneredSwordsman),
      ).toBeSuccessfulCommand();

      // Maui should be exerted after challenge
      expect(testEngine.asPlayerOne().isExerted(mauiHeroToAll)).toBe(true);

      // Pass turn - Simba's end-of-turn trigger fires
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Resolve the optional ability (accept)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaPrideProtector, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Maui should be readied
      expect(testEngine.asPlayerOne().isExerted(mauiHeroToAll)).toBe(false);

      // Turn should have passed to player two (Reckless Maui should NOT be forced to challenge again)
      expect(testEngine.getActivePlayer()).toBe(PLAYER_TWO);
    });

    // 7.4.4. Some triggered abilities are written as [Trigger Condition], if [Secondary Condition], [Effect].
    // These abilities check whether the secondary condition is true both when the effect would be added
    // to the bag and again when the effect resolves.
    it("two Simbas should not untap each other", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: simbaPrideProtector, exerted: true },
            { card: simbaPrideProtector, exerted: true },
          ],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const simbaInstances = testEngine.getCardInstanceIdsInZone("play", "p1");
      const simbaZero = simbaInstances[0]!;
      const simbaOne = simbaInstances[1]!;

      // Both Simbas are exerted
      expect(testEngine.asPlayerOne().isExerted(simbaZero)).toBe(true);
      expect(testEngine.asPlayerOne().isExerted(simbaOne)).toBe(true);

      // Pass turn - both Simbas trigger
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Should have 2 bag effects (one per Simba)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

      // Resolve first Simba's trigger (accept optional)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolveBag(bagEffects[0]!.id, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // After first resolution: one Simba should be readied, the other still exerted
      const zeroExerted = testEngine.asPlayerOne().isExerted(simbaZero);
      const oneExerted = testEngine.asPlayerOne().isExerted(simbaOne);
      expect(zeroExerted).not.toBe(oneExerted);

      // Resolve second Simba's trigger - its source is no longer exerted, so the conditional should fail
      const remainingBag = testEngine.asPlayerOne().getBagEffects();
      if (remainingBag.length > 0) {
        testEngine.asPlayerOne().resolveBag(remainingBag[0]!.id, { resolveOptional: true });
      }

      // Still only one Simba should be exerted (the second trigger should have fizzled)
      const finalZeroExerted = testEngine.asPlayerOne().isExerted(simbaZero);
      const finalOneExerted = testEngine.asPlayerOne().isExerted(simbaOne);
      expect(finalZeroExerted).not.toBe(finalOneExerted);

      // No more bag effects
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
