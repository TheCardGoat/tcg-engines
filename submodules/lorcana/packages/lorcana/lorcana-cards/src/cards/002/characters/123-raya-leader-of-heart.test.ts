import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rayaLeaderOfHeart } from "./123-raya-leader-of-heart";

// Raya: strength 5, willpower 3
// Defender needs willpower > 5 to survive Raya's attack
// Defender needs strength < 4 (Raya's willpower 3) to avoid banishing Raya

const damagedDefender = createMockCharacter({
  id: "raya-loh-damaged-defender",
  name: "Damaged Defender",
  cost: 3,
  strength: 4,
  willpower: 10,
  lore: 1,
});

// Strength 2 so Raya (willpower 3) survives the challenge
const undamagedDefender = createMockCharacter({
  id: "raya-loh-undamaged-defender",
  name: "Undamaged Defender",
  cost: 3,
  strength: 2,
  willpower: 10,
  lore: 1,
});

describe("Raya - Leader of Heart", () => {
  describe("CHAMPION OF KUMANDRA — Whenever this character challenges a damaged character, she takes no damage from the challenge.", () => {
    it("takes no damage when challenging a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rayaLeaderOfHeart],
          deck: 2,
        },
        {
          play: [{ card: damagedDefender, exerted: true }],
          deck: 2,
        },
      );

      testEngine.asServer().manualSetDamage(damagedDefender, 2);

      expect(
        testEngine.asPlayerOne().challenge(rayaLeaderOfHeart, damagedDefender),
      ).toBeSuccessfulCommand();

      // Raya takes no damage from the challenge because the defender was damaged
      expect(testEngine.asPlayerOne().getDamage(rayaLeaderOfHeart)).toBe(0);
      // The defender still takes damage from Raya's strength
      expect(testEngine.asPlayerTwo().getDamage(damagedDefender)).toBe(7); // 2 pre-existing + 5 from Raya's strength (wp 10, so survives)
    });

    it("takes damage when challenging an undamaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rayaLeaderOfHeart],
          deck: 2,
        },
        {
          play: [{ card: undamagedDefender, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(rayaLeaderOfHeart, undamagedDefender),
      ).toBeSuccessfulCommand();

      // Raya takes damage because the defender was undamaged (ability does not fire)
      expect(testEngine.asPlayerOne().getDamage(rayaLeaderOfHeart)).toBe(2); // defender strength 2
      // The defender takes damage from Raya's strength
      expect(testEngine.asPlayerTwo().getDamage(undamagedDefender)).toBe(5); // Raya's strength 5
    });
  });
});
