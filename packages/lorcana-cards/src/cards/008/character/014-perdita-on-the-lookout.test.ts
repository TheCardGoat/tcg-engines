// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DalmatianPuppyTailWagger,
//   PerditaOnTheLookout,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Perdita - On the Lookout", () => {
//   It("KEEPING WATCH While you have a Puppy character in play, this character gets +1 {W}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [perditaOnTheLookout, dalmatianPuppyTailWagger],
//     });
//
//     Const cardToTest = testEngine.getCardModel(perditaOnTheLookout);
//
//     Expect(cardToTest.willpower).toBe(perditaOnTheLookout.willpower + 1);
//   });
// });
//
