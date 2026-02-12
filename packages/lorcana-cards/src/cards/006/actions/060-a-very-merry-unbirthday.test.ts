// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { aVeryMerryUnbirthday } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("A Very Merry Unbirthday", () => {
//   It.skip("(A character with cost 1 or more can {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: aVeryMerryUnbirthday.cost,
//       Play: [aVeryMerryUnbirthday],
//       Hand: [aVeryMerryUnbirthday],
//     });
//
//     Await testEngine.playCard(aVeryMerryUnbirthday);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Each opponent puts the top 2 cards of their deck into their discard.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: aVeryMerryUnbirthday.cost,
//       Play: [aVeryMerryUnbirthday],
//       Hand: [aVeryMerryUnbirthday],
//     });
//
//     Await testEngine.playCard(aVeryMerryUnbirthday);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
