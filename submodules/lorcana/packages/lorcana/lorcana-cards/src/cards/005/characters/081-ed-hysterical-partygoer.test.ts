import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { edHystericalPartygoer } from "./081-ed-hysterical-partygoer";

const damagedAttacker = createMockCharacter({
  id: "ed-test-damaged-attacker",
  name: "Damaged Attacker",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const undamagedAttacker = createMockCharacter({
  id: "ed-test-undamaged-attacker",
  name: "Undamaged Attacker",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Ed - Hysterical Partygoer", () => {
  describe("ROWDY GUEST: Damaged characters can't challenge this character.", () => {
    it("a damaged character cannot challenge Ed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: damagedAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: edHystericalPartygoer, exerted: true }],
          deck: 1,
        },
      );

      testEngine.asServer().manualSetDamage(damagedAttacker, 1);

      const result = testEngine.asPlayerOne().challenge(damagedAttacker, edHystericalPartygoer);

      expect(result).not.toBeSuccessfulCommand();
    });

    it("an undamaged character can challenge Ed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: undamagedAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: edHystericalPartygoer, exerted: true }],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(undamagedAttacker, edHystericalPartygoer);

      expect(result).toBeSuccessfulCommand();
    });

    it("a damaged character can still challenge other characters (not Ed)", () => {
      const otherDefender = createMockCharacter({
        id: "ed-test-other-defender",
        name: "Other Defender",
        cost: 2,
        strength: 1,
        willpower: 6,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: damagedAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: edHystericalPartygoer, exerted: false },
            { card: otherDefender, exerted: true },
          ],
          deck: 1,
        },
      );

      testEngine.asServer().manualSetDamage(damagedAttacker, 1);

      const result = testEngine.asPlayerOne().challenge(damagedAttacker, otherDefender);

      expect(result).toBeSuccessfulCommand();
    });
  });
});
