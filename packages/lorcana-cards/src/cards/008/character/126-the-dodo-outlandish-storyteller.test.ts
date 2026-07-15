// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { theDodoOutlandishStoryteller } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Dodo - Outlandish Storyteller", () => {
//   It("AN EXTREMELY FATAL SITUATION This character receives +1 {S} for each damage on it.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theDodoOutlandishStoryteller],
//     });
//
//     Const cardToTest = testEngine.getCardModel(theDodoOutlandishStoryteller);
//     Console.log("Before", cardToTest.strength);
//     CardToTest.damage = 2;
//
//     Console.log("after", cardToTest.strength);
//     Expect(cardToTest.strength).toBe(2);
//   });
// });
//
