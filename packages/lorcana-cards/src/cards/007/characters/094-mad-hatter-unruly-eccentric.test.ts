// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { madHatterUnrulyEccentric } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mad Hatter - Unruly Eccentric", () => {
//   it.skip("UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: madHatterUnrulyEccentric.cost,
//       play: [madHatterUnrulyEccentric],
//       hand: [madHatterUnrulyEccentric],
//     });
//
//     await testEngine.playCard(madHatterUnrulyEccentric);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
