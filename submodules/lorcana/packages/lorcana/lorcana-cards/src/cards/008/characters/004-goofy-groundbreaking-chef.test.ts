import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrSmeeBumblingMate } from "../../003/characters/184-mr-smee-bumbling-mate";
import { goofyGroundbreakingChef } from "./004-goofy-groundbreaking-chef";

const damagedAlly = createMockCharacter({
  id: "goofy-test-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const anotherDamagedAlly = createMockCharacter({
  id: "goofy-test-another-damaged-ally",
  name: "Another Damaged Ally",
  cost: 3,
  strength: 3,
  willpower: 6,
});

const undamagedAlly = createMockCharacter({
  id: "goofy-test-undamaged-ally",
  name: "Undamaged Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Goofy - Groundbreaking Chef", () => {
  describe("PLENTY TO GO AROUND - At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.", () => {
    it("removes 1 damage and readies damaged characters at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            goofyGroundbreakingChef,
            { card: damagedAlly, damage: 3, exerted: true },
            { card: anotherDamagedAlly, damage: 2, exerted: true },
          ],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Verify initial state
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(3);
      expect(testEngine.asPlayerOne().getDamage(anotherDamagedAlly)).toBe(2);
      expect(testEngine.asPlayerOne().isExerted(damagedAlly)).toBe(true);
      expect(testEngine.asPlayerOne().isExerted(anotherDamagedAlly)).toBe(true);

      // Pass turn to trigger end-of-turn effect
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Should have a bag effect for the triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve the bag effect (accept the optional ability)
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goofyGroundbreakingChef, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Each damaged character should have 1 less damage
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(anotherDamagedAlly)).toBe(1);

      // Each character that had damage removed should be readied
      expect(testEngine.asPlayerOne().isExerted(damagedAlly)).toBe(false);
      expect(testEngine.asPlayerOne().isExerted(anotherDamagedAlly)).toBe(false);
    });

    it("does not ready undamaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            goofyGroundbreakingChef,
            { card: damagedAlly, damage: 2, exerted: true },
            { card: undamagedAlly, exerted: true },
          ],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goofyGroundbreakingChef, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Damaged ally should be healed and readied
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(1);
      expect(testEngine.asPlayerOne().isExerted(damagedAlly)).toBe(false);

      // Undamaged ally should still be exerted (no damage was removed)
      expect(testEngine.asPlayerOne().isExerted(undamagedAlly)).toBe(true);
    });

    it("does not affect Goofy himself (other characters only)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: goofyGroundbreakingChef, damage: 2, exerted: true },
            { card: damagedAlly, damage: 1, exerted: true },
          ],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goofyGroundbreakingChef, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Goofy's damage should be unchanged (excludeSelf)
      expect(testEngine.asPlayerOne().getDamage(goofyGroundbreakingChef)).toBe(2);
      // Goofy should still be exerted
      expect(testEngine.asPlayerOne().isExerted(goofyGroundbreakingChef)).toBe(true);

      // Ally should be healed and readied
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
      expect(testEngine.asPlayerOne().isExerted(damagedAlly)).toBe(false);
    });

    it("does NOT remove damage from opponent's damaged characters (player bug report 2026-05-09)", () => {
      // Reporter "Slightly Uninvited" (gameId mgbZKN9BYqSm72mr13wz5on, turn 15)
      // claimed Goofy was removing damage and readying the OPPONENT's exerted
      // damaged characters. Card def declares owner: "you" + excludeSelf: true.
      //
      // We assert the verifiable half: opponent's damaged characters retain
      // their damage after Goofy resolves. The "still exerted" half can't be
      // asserted cleanly via passTurn() — by the time we can observe, the
      // opponent's Ready step has run and readied all their characters
      // regardless of Goofy. The reporter likely conflated the natural Ready
      // step with Goofy's effect.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [goofyGroundbreakingChef, { card: damagedAlly, damage: 2, exerted: true }],
          deck: 2,
        },
        {
          play: [{ card: anotherDamagedAlly, damage: 2, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goofyGroundbreakingChef, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Own damaged ally: healed and readied.
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(1);
      expect(testEngine.asPlayerOne().isExerted(damagedAlly)).toBe(false);

      // Opponent's damaged ally: damage preserved. This proves the
      // owner: "you" filter on remove-damage targets is being respected.
      expect(testEngine.asPlayerTwo().getDamage(anotherDamagedAlly)).toBe(2);
    });

    it("prevents Mr. Smee from damaging himself if Goofy readies and heals him first", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [goofyGroundbreakingChef, { card: mrSmeeBumblingMate, damage: 1, exerted: true }],
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goofyGroundbreakingChef, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(mrSmeeBumblingMate)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().isExerted(mrSmeeBumblingMate)).toBe(false);
    });
  });
});
