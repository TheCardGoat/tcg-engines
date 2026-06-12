import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { panicHighstrungImp } from "./075-panic-high-strung-imp";

const damagedAllyCharacter = createMockCharacter({
  id: "panic-hsi-damaged-ally",
  name: "Damaged Ally",
  cost: 3,
  strength: 2,
  willpower: 6,
});

const opponentTarget = createMockCharacter({
  id: "panic-hsi-opponent-target",
  name: "Opponent Target",
  cost: 3,
  strength: 2,
  willpower: 6,
});

describe("Panic - High-Strung Imp", () => {
  describe("STARTLED SHRIEK - When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.", () => {
    it("moves damage counters from chosen character to chosen opposing character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [panicHighstrungImp],
          play: [{ card: damagedAllyCharacter, damage: 3 }],
          inkwell: panicHighstrungImp.cost,
          deck: 5,
        },
        {
          play: [opponentTarget],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(panicHighstrungImp)).toBeSuccessfulCommand();

      // Optional triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept and provide both targets: source character and opposing character
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(panicHighstrungImp, {
          resolveOptional: true,
          targets: [damagedAllyCharacter, opponentTarget],
        }),
      ).toBeSuccessfulCommand();

      // Ally had 3 damage, 2 moved away: should now have 1
      expect(testEngine.asPlayerOne().getDamage(damagedAllyCharacter)).toBe(1);
      // Opponent should have received 2 damage
      expect(testEngine.asPlayerTwo().getDamage(opponentTarget)).toBe(2);
    });

    it("is optional — can decline moving damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [panicHighstrungImp],
          play: [{ card: damagedAllyCharacter, damage: 2 }],
          inkwell: panicHighstrungImp.cost,
          deck: 5,
        },
        {
          play: [opponentTarget],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(panicHighstrungImp)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(panicHighstrungImp, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne().getDamage(damagedAllyCharacter)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(opponentTarget)).toBe(0);
    });

    it("moves fewer than 2 damage counters when the source character has less than 2 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [panicHighstrungImp],
          play: [{ card: damagedAllyCharacter, damage: 1 }],
          inkwell: panicHighstrungImp.cost,
          deck: 5,
        },
        {
          play: [opponentTarget],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(panicHighstrungImp)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(panicHighstrungImp, {
          resolveOptional: true,
          targets: [damagedAllyCharacter, opponentTarget],
        }),
      ).toBeSuccessfulCommand();

      // Only 1 damage was available to move
      expect(testEngine.asPlayerOne().getDamage(damagedAllyCharacter)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opponentTarget)).toBe(1);
    });
  });
});
