import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { scarVengefulLion } from "./093-scar-vengeful-lion";

const damagedDefender = createMockCharacter({
  id: "scar-damaged-defender",
  name: "Damaged Defender",
  cost: 2,
  strength: 1,
  willpower: 5,
});

const undamagedDefender = createMockCharacter({
  id: "scar-undamaged-defender",
  name: "Undamaged Defender",
  cost: 2,
  strength: 1,
  willpower: 5,
});

const attackerChar = createMockCharacter({
  id: "scar-attacker-char",
  name: "Attacker Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Scar - Vengeful Lion", () => {
  describe("LIFE'S NOT FAIR, IS IT? - Whenever one of your characters challenges a damaged character, you may draw a card.", () => {
    it("triggers when your character challenges a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: scarVengefulLion, isDrying: false },
            { card: attackerChar, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: damagedDefender, exerted: true, damage: 1 }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(attackerChar, damagedDefender),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarVengefulLion, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("does NOT trigger when challenging an undamaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: scarVengefulLion, isDrying: false },
            { card: attackerChar, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: undamagedDefender, exerted: true }],
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attackerChar, undamagedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does NOT trigger when opponent's character challenges a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: scarVengefulLion, isDrying: false },
            { card: damagedDefender, exerted: true, damage: 1 },
          ],
          deck: 3,
        },
        {
          play: [{ card: attackerChar, isDrying: false }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerTwo().challenge(attackerChar, damagedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore);
    });

    it("triggers when Scar himself challenges a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scarVengefulLion, isDrying: false }],
          deck: 3,
        },
        {
          play: [{ card: damagedDefender, exerted: true, damage: 1 }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(scarVengefulLion, damagedDefender),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarVengefulLion, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
    });
  });
});
