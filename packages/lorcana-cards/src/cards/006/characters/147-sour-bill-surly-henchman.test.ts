// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { sourBillSurlyHenchman } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Sour Bill - Surly Henchman", () => {
//   It.skip("UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: sourBillSurlyHenchman.cost,
//       Hand: [sourBillSurlyHenchman],
//     });
//
//     Await testEngine.playCard(sourBillSurlyHenchman);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
