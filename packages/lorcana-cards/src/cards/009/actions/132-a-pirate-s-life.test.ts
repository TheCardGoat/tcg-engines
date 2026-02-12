// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("A Pirate's Life", () => {
//   It.skip("SING TOGETHER 6 (Any number of your or your teammates’ characters with total cost 6 or more may {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: aPiratesLife.cost,
//       Play: [aPiratesLife],
//       Hand: [aPiratesLife],
//     });
//
//     Await testEngine.playCard(aPiratesLife);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Each opponent loses 2 lore. You gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: aPiratesLife.cost,
//       Play: [aPiratesLife],
//       Hand: [aPiratesLife],
//     });
//
//     Await testEngine.playCard(aPiratesLife);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
