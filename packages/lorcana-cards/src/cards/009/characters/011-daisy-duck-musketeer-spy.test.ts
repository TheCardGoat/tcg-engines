// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { daisyDuckMusketeerSpy } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Daisy Duck - Musketeer Spy", () => {
//   it.skip("INFILTRATION When you play this character, each opponent chooses and discards a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: daisyDuckMusketeerSpy.cost,
//       hand: [daisyDuckMusketeerSpy],
//     });
//
//     await testEngine.playCard(daisyDuckMusketeerSpy);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
