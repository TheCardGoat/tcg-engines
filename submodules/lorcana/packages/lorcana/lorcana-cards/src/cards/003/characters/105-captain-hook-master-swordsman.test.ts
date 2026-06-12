import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { captainHookMasterSwordsman } from "./105-captain-hook-master-swordsman";
import { peterPanNeverLanding } from "../../001";

const weakEnemy = createMockCharacter({
  id: "hook-test-weak",
  name: "Weak Enemy",
  cost: 1,
  willpower: 3,
  strength: 1,
});

const weakEnemy2 = createMockCharacter({
  id: "hook-test-weak-2",
  name: "Weak Enemy 2",
  cost: 1,
  willpower: 3,
  strength: 1,
});

const toughEnemy = createMockCharacter({
  id: "hook-test-tough",
  name: "Tough Enemy",
  cost: 3,
  willpower: 10,
  strength: 1,
});

describe("Captain Hook - Master Swordsman", () => {
  describe("NEMESIS - During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.", () => {
    it("readies itself and gets a quest restriction when it banishes a character in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [captainHookMasterSwordsman],
          deck: 1,
        },
        {
          play: [{ card: weakEnemy, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(captainHookMasterSwordsman, weakEnemy),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(weakEnemy)).toBe("discard");

      // NEMESIS is not optional (unlike Scar), so it should auto-resolve
      // Captain Hook should be ready and have a quest restriction
      expect(testEngine.asPlayerOne().isExerted(captainHookMasterSwordsman)).toBe(false);
      expect(
        testEngine.asPlayerOne().getCard(captainHookMasterSwordsman)?.hasQuestRestriction,
      ).toBe(true);
      expect(testEngine.asPlayerOne().quest(captainHookMasterSwordsman).success).toBe(false);
    });

    it("can challenge multiple times in a turn when it keeps banishing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [captainHookMasterSwordsman],
          deck: 1,
        },
        {
          play: [
            { card: weakEnemy, exerted: true },
            { card: weakEnemy2, exerted: true },
          ],
          deck: 1,
        },
      );

      // First challenge - banishes weak enemy, Hook readies
      expect(
        testEngine.asPlayerOne().challenge(captainHookMasterSwordsman, weakEnemy),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(weakEnemy)).toBe("discard");
      expect(testEngine.asPlayerOne().isExerted(captainHookMasterSwordsman)).toBe(false);

      // Second challenge - Hook can challenge again since he's ready
      expect(
        testEngine.asPlayerOne().challenge(captainHookMasterSwordsman, weakEnemy2),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(weakEnemy2)).toBe("discard");
      expect(testEngine.asPlayerOne().isExerted(captainHookMasterSwordsman)).toBe(false);

      // Still can't quest
      expect(
        testEngine.asPlayerOne().getCard(captainHookMasterSwordsman)?.hasQuestRestriction,
      ).toBe(true);
    });

    it("does not trigger when Captain Hook does not banish the defender", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [captainHookMasterSwordsman],
          deck: 1,
        },
        {
          play: [{ card: toughEnemy, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(captainHookMasterSwordsman, toughEnemy),
      ).toBeSuccessfulCommand();

      // Captain Hook (5 strength) does not banish tough enemy (10 willpower)
      // NEMESIS should NOT trigger - Hook stays exerted
      expect(testEngine.asPlayerOne().isExerted(captainHookMasterSwordsman)).toBe(true);
      expect(
        testEngine.asPlayerOne().getCard(captainHookMasterSwordsman)?.hasQuestRestriction,
      ).toBe(false);
    });
  });

  describe("MAN-TO-MAN - Characters named Peter Pan lose Evasive and can't gain Evasive.", () => {
    it("removes Evasive from Peter Pan characters while Captain Hook is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [captainHookMasterSwordsman],
          deck: 1,
        },
        {
          play: [peterPanNeverLanding],
          deck: 1,
        },
      );

      // Peter Pan - Never Landing normally has Evasive, but Captain Hook removes it
      expect(testEngine.asPlayerTwo().hasKeyword(peterPanNeverLanding, "Evasive")).toBe(false);
    });

    it("does not remove Evasive from non-Peter Pan characters", () => {
      const evasiveNonPeterPan = createMockCharacter({
        id: "hook-test-evasive",
        name: "Evasive Guy",
        cost: 2,
        abilities: [
          {
            id: "hook-test-evasive-keyword",
            type: "keyword",
            keyword: "Evasive",
            text: "Evasive",
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [captainHookMasterSwordsman],
          deck: 1,
        },
        {
          play: [evasiveNonPeterPan],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(evasiveNonPeterPan, "Evasive")).toBe(true);
    });
  });
});
