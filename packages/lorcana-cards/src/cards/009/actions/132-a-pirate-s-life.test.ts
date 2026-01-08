// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("A Pirate's Life", () => {
//   it.skip("SING TOGETHER 6 (Any number of your or your teammates’ characters with total cost 6 or more may {E} to sing this song for free.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: aPiratesLife.cost,
//       play: [aPiratesLife],
//       hand: [aPiratesLife],
//     });
//
//     await testEngine.playCard(aPiratesLife);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Each opponent loses 2 lore. You gain 2 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: aPiratesLife.cost,
//       play: [aPiratesLife],
//       hand: [aPiratesLife],
//     });
//
//     await testEngine.playCard(aPiratesLife);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
