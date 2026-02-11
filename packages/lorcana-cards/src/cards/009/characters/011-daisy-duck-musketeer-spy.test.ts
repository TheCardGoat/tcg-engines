// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { daisyDuckMusketeerSpy } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Daisy Duck - Musketeer Spy", () => {
//   It.skip("INFILTRATION When you play this character, each opponent chooses and discards a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: daisyDuckMusketeerSpy.cost,
//       Hand: [daisyDuckMusketeerSpy],
//     });
//
//     Await testEngine.playCard(daisyDuckMusketeerSpy);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
