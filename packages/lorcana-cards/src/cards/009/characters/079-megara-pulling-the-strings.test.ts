// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { megaraPullingTheStrings } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Megara - Pulling the Strings", () => {
//   it.skip("WONDER BOY When you play this character, chosen character gets +2 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: megaraPullingTheStrings.cost,
//       hand: [megaraPullingTheStrings],
//     });
//
//     await testEngine.playCard(megaraPullingTheStrings);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
