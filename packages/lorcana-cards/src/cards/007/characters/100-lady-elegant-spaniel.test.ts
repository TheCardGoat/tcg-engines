// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   ladyElegantSpaniel,
//   trampEnterprisingDog,
// } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.", () => {
//   it("should have +1 {L} with Tramp in play", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [ladyElegantSpaniel, trampEnterprisingDog],
//       hand: [],
//     });
//
//     expect(testEngine.getCardModel(ladyElegantSpaniel).lore).toEqual(2);
//   });
//   it("should 1 {L} without Tramp in play", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [ladyElegantSpaniel],
//       hand: [],
//     });
//
//     expect(testEngine.getCardModel(ladyElegantSpaniel).lore).toEqual(1);
//   });
// });
//
