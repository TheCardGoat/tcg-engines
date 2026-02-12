import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { cheshireCatNotAllThere } from "./071-cheshire-cat-not-all-there";

describe("Cheshire Cat - Not All There", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [cheshireCat] });
  //   Expect(testEngine.getCardModel(cheshireCat).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CheshireCat,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Export const cheshireCatNotAllThereTestCase = async () => {
//   Const testEngine = new TestEngine(
//     {
//       Play: [teKaTheBurningOne],
//     },
//     {
//       Play: [cheshireCat],
//     },
//   );
//
//   Const cardUnderTest = testEngine.getCardModel(cheshireCat);
//   Const attacker = testEngine.getCardModel(teKaTheBurningOne);
//
//   Expect(cardUnderTest.zone).toEqual("play");
//   CardUnderTest.updateCardMeta({ exerted: true });
//
//   Await testEngine.challenge({
//     Attacker: attacker,
//     Defender: cardUnderTest,
//   });
//
//   Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//     Expect.objectContaining({ discard: 1, play: 0 }),
//   );
//   Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//     Expect.objectContaining({ discard: 1, play: 0 }),
//   );
// };
//
// Describe("Cheshire Cat - Not All There", () => {
//   It("**Lose something?** When this character is challenged and banished, banish the challenging character.", () => {
//     CheshireCatNotAllThereTestCase();
//   });
// });
//
