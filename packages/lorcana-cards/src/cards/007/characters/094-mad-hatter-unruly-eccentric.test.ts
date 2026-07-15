// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { madHatterUnrulyEccentric } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mad Hatter - Unruly Eccentric", () => {
//   It.skip("UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: madHatterUnrulyEccentric.cost,
//       Play: [madHatterUnrulyEccentric],
//       Hand: [madHatterUnrulyEccentric],
//     });
//
//     Await testEngine.playCard(madHatterUnrulyEccentric);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
