import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { suddenChill } from "../../001/actions/098-sudden-chill";
import { simbaProtectiveCub } from "../../001/characters/020-simba-protective-cub";
import { kronkLaidBack } from "./063-kronk-laid-back";
import { yzmaAboveItAll } from "./068-yzma-above-it-all";

describe("Kronk - Laid Back", () => {
  describe("I'M LOVIN' THIS - If an effect would cause you to discard one or more cards, you don't discard.", () => {
    it("prevents the controller from discarding when an opponent plays Sudden Chill", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [suddenChill],
          inkwell: suddenChill.cost,
        },
        {
          play: [kronkLaidBack],
          hand: [simbaProtectiveCub],
        },
      );

      expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();

      // Player two has Kronk in play: the discard should be prevented (no pending discard choice)
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerTwo()).toHaveZoneCounts({
        hand: 1,
        discard: 0,
      });
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
    });

    it("does not prevent the opponent from discarding (Kronk only protects its own controller)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kronkLaidBack],
          hand: [suddenChill],
          inkwell: suddenChill.cost,
        },
        {
          hand: [simbaProtectiveCub],
        },
      );

      expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();

      // Player two does NOT have Kronk, so they must discard
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [simbaProtectiveCub],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo()).toHaveZoneCounts({
        hand: 0,
        discard: 1,
      });
    });

    it("regression: prevents Yzma - Above It All from forcing discard when banishing in challenge", () => {
      const attacker = createMockCharacter({
        id: "kronk-test-attacker",
        name: "Attacker",
        cost: 3,
        strength: 5,
        willpower: 5,
      });

      const defender = createMockCharacter({
        id: "kronk-test-defender",
        name: "Defender",
        cost: 2,
        strength: 1,
        willpower: 1,
      });

      // P1 has Yzma. P2 has Kronk + attacker.
      // When P2's attacker banishes P1's defender in challenge, Yzma triggers
      // to return the defender to P1's hand and make P1 discard at random.
      // But P2 has Kronk, so P2's discard should be prevented.
      // Actually: Yzma triggers for "another character banished in challenge" - returns to its player's hand + that player discards.
      // The banished character belongs to P1, so P1 gets the card back in hand and P1 discards.
      // Kronk protects its controller (P2) - but the discard is targeting P1 (the banished character's owner).
      // So for THIS scenario, Kronk on P2 doesn't matter.
      // Let's flip: P1 has Kronk + Yzma belongs to P2. P1's character gets banished.
      // Yzma returns P1's character to hand and P1 discards. Kronk on P1 prevents P1's discard.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kronkLaidBack, { card: defender, exerted: true, isDrying: false }],
          hand: [simbaProtectiveCub],
          deck: 3,
        },
        {
          play: [yzmaAboveItAll, { card: attacker, isDrying: false }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // P2 attacks P1's defender
      expect(testEngine.asPlayerTwo().challenge(attacker, defender)).toBeSuccessfulCommand();

      // Yzma triggers: returns defender to P1's hand, then P1 should discard at random
      // But Kronk prevents P1's discard
      // Resolve Yzma's trigger
      const bagCount = testEngine.asPlayerTwo().getBagCount();
      if (bagCount > 0) {
        const bagEffects = testEngine.asPlayerTwo().getBagEffects();
        for (const bagEffect of bagEffects) {
          testEngine.asPlayerTwo().resolvePendingByCard(kronkLaidBack);
        }
      }

      // Defender should be returned to P1's hand by Yzma
      expect(testEngine.asPlayerOne().getCardZone(defender)).toBe("hand");

      // P1 should NOT have had to discard because Kronk prevents it
      // Simba should still be in hand (not discarded)
      expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    });
  });
});
