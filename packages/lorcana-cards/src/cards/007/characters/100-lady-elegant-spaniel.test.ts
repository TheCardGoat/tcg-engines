// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LadyElegantSpaniel,
//   TrampEnterprisingDog,
// } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.", () => {
//   It("should have +1 {L} with Tramp in play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [ladyElegantSpaniel, trampEnterprisingDog],
//       Hand: [],
//     });
//
//     Expect(testEngine.getCardModel(ladyElegantSpaniel).lore).toEqual(2);
//   });
//   It("should 1 {L} without Tramp in play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [ladyElegantSpaniel],
//       Hand: [],
//     });
//
//     Expect(testEngine.getCardModel(ladyElegantSpaniel).lore).toEqual(1);
//   });
// });
//
