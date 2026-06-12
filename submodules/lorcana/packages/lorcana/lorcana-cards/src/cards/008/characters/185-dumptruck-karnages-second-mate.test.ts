import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dumptruckKarnagesSecondMate } from "./185-dumptruck-karnages-second-mate";

const target = createMockCharacter({
  id: "dumptruck-target",
  name: "Target Character",
  cost: 2,
  willpower: 5,
});

describe("Dumptruck - Karnage's Second Mate", () => {
  describe("LET ME AT 'EM - When you play this character, you may deal 1 damage to chosen character.", () => {
    it("triggers when played and offers optional damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dumptruckKarnagesSecondMate],
          inkwell: dumptruckKarnagesSecondMate.cost,
        },
        {
          play: [target],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(dumptruckKarnagesSecondMate),
      ).toBeSuccessfulCommand();

      // Should have a bag effect for the optional triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("deals 1 damage when accepted and target is chosen", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dumptruckKarnagesSecondMate],
          inkwell: dumptruckKarnagesSecondMate.cost,
        },
        {
          play: [target],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(dumptruckKarnagesSecondMate),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(dumptruckKarnagesSecondMate, { targets: [target] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(target)).toBe(1);
    });
  });
});
