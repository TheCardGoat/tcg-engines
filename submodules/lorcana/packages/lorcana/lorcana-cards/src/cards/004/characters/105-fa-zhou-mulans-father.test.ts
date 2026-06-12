import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { faZhouMulansFather } from "./105-fa-zhou-mulans-father";
import { mulanEnemyOfEntanglement } from "./115-mulan-enemy-of-entanglement";

const nonMulanCharacter = createMockCharacter({
  id: "fa-zhou-test-non-mulan",
  name: "Not Mulan",
  cost: 2,
});

describe("Fa Zhou - Mulan's Father", () => {
  describe("WAR INJURY - This character can't challenge.", () => {
    it("prevents Fa Zhou from challenging", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [faZhouMulansFather],
        },
        {
          play: [{ card: nonMulanCharacter, exerted: true }],
        },
      );

      const faZhouId = testEngine.findCardInstanceId(faZhouMulansFather, "play", "p1");
      const targetId = testEngine.findCardInstanceId(nonMulanCharacter, "play", "p2");

      expect(testEngine.asPlayerOne().canChallenge(faZhouId, targetId)).toBe(false);
    });
  });

  describe("HEAD OF THE HOUSEHOLD - {E} — Ready chosen character named Mulan. She can't quest for the rest of this turn.", () => {
    it("readies an exerted Mulan character and applies cant-quest restriction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: faZhouMulansFather, isDrying: false },
          { card: mulanEnemyOfEntanglement, exerted: true },
        ],
      });

      const mulanId = testEngine.findCardInstanceId(mulanEnemyOfEntanglement, "play", "p1");

      expect(testEngine.asPlayerOne().isExerted(mulanId)).toBe(true);

      expect(
        testEngine.asPlayerOne().activateAbility(faZhouMulansFather, {
          targets: [mulanId],
        }),
      ).toBeSuccessfulCommand();

      // Mulan should be readied
      expect(testEngine.asPlayerOne().isExerted(mulanId)).toBe(false);

      // Mulan should have cant-quest restriction
      expect(testEngine.hasRestriction(mulanEnemyOfEntanglement, "cant-quest")).toBe(true);

      // Fa Zhou should be exerted after using the ability
      expect(testEngine.asPlayerOne().isExerted(faZhouMulansFather)).toBe(true);
    });

    it("cant-quest restriction expires after the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: faZhouMulansFather, isDrying: false },
          { card: mulanEnemyOfEntanglement, exerted: true },
        ],
      });

      const mulanId = testEngine.findCardInstanceId(mulanEnemyOfEntanglement, "play", "p1");

      expect(
        testEngine.asPlayerOne().activateAbility(faZhouMulansFather, {
          targets: [mulanId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(mulanEnemyOfEntanglement, "cant-quest")).toBe(true);

      // End player one's turn, then player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Restriction should have expired
      expect(testEngine.hasRestriction(mulanEnemyOfEntanglement, "cant-quest")).toBe(false);
    });
  });
});
