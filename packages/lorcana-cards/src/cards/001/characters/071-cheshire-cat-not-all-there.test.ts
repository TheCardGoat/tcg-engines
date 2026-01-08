import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { cheshireCatNotAllThere } from "./071-cheshire-cat-not-all-there";

describe("Cheshire Cat - Not All There", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [cheshireCat] });
  //   expect(testEngine.getCardModel(cheshireCat).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   cheshireCat,
//   teKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// export const cheshireCatNotAllThereTestCase = async () => {
//   const testEngine = new TestEngine(
//     {
//       play: [teKaTheBurningOne],
//     },
//     {
//       play: [cheshireCat],
//     },
//   );
//
//   const cardUnderTest = testEngine.getCardModel(cheshireCat);
//   const attacker = testEngine.getCardModel(teKaTheBurningOne);
//
//   expect(cardUnderTest.zone).toEqual("play");
//   cardUnderTest.updateCardMeta({ exerted: true });
//
//   await testEngine.challenge({
//     attacker: attacker,
//     defender: cardUnderTest,
//   });
//
//   expect(testEngine.getZonesCardCount("player_one")).toEqual(
//     expect.objectContaining({ discard: 1, play: 0 }),
//   );
//   expect(testEngine.getZonesCardCount("player_two")).toEqual(
//     expect.objectContaining({ discard: 1, play: 0 }),
//   );
// };
//
// describe("Cheshire Cat - Not All There", () => {
//   it("**Lose something?** When this character is challenged and banished, banish the challenging character.", () => {
//     cheshireCatNotAllThereTestCase();
//   });
// });
//
