// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { thisIsMyFamily } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("This Is My Family", () => {
//   It.skip("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: thisIsMyFamily.cost,
//       Play: [thisIsMyFamily],
//       Hand: [thisIsMyFamily],
//     });
//
//     Await testEngine.playCard(thisIsMyFamily);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Gain 1 lore. Draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: thisIsMyFamily.cost,
//       Play: [thisIsMyFamily],
//       Hand: [thisIsMyFamily],
//     });
//
//     Await testEngine.playCard(thisIsMyFamily);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
