// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { poorUnfortunateSouls } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Poor Unfortunate Souls", () => {
//   It.skip("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: poorUnfortunateSouls.cost,
//       Play: [poorUnfortunateSouls],
//       Hand: [poorUnfortunateSouls],
//     });
//
//     Await testEngine.playCard(poorUnfortunateSouls);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Return chosen character, item, or location with cost 2 or less to their player's hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: poorUnfortunateSouls.cost,
//       Play: [poorUnfortunateSouls],
//       Hand: [poorUnfortunateSouls],
//     });
//
//     Await testEngine.playCard(poorUnfortunateSouls);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
