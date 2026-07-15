import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dopeyKnightApprentice } from "./181-dopey-knight-apprentice";
import { dopeyAlwaysPlayful } from "../../002/characters/006-dopey-always-playful";
import { sleepySluggishKnight } from "./177-sleepy-sluggish-knight";

const targetCharacter = createMockCharacter({
  id: "dopey-ka-target",
  name: "Target Character",
  cost: 2,
  willpower: 5,
});

describe("Dopey - Knight Apprentice", () => {
  describe("STRONGER TOGETHER - When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.", () => {
    it("does not trigger when Dopey is the only Knight in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dopeyKnightApprentice],
          inkwell: dopeyKnightApprentice.cost,
          play: [dopeyAlwaysPlayful],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(dopeyKnightApprentice)).toBeSuccessfulCommand();
      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("triggers and deals 1 damage when another Knight is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dopeyKnightApprentice],
          inkwell: dopeyKnightApprentice.cost,
          play: [sleepySluggishKnight],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(dopeyKnightApprentice)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(dopeyKnightApprentice, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(1);
    });

    it("can decline the optional effect when another Knight is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dopeyKnightApprentice],
          inkwell: dopeyKnightApprentice.cost,
          play: [sleepySluggishKnight],
        },
        {
          play: [targetCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(dopeyKnightApprentice)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(dopeyKnightApprentice, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(0);
    });
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dopeyAlwaysPlayful } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { dopeyKnightApprentice } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dopey - Knight Apprentice", () => {
//   Describe("**STRONGER TOGETHER** When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.", () => {
//     It("Doesn't trigger when he's the only knight in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: dopeyKnightApprentice.cost,
//         Hand: [dopeyKnightApprentice],
//         Play: [dopeyAlwaysPlayful],
//       });
//
//       Await testEngine.playCard(dopeyKnightApprentice);
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
