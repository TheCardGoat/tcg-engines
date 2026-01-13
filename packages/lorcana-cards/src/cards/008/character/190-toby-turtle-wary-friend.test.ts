// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tobyTurtleWaryFriend } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Toby Turtle - Wary Friend", () => {
//   it("HARD SHELL While this character is exerted, he gains Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: tobyTurtleWaryFriend.cost,
//       play: [tobyTurtleWaryFriend],
//       hand: [],
//     });
//
//     expect(testEngine.getCardModel(tobyTurtleWaryFriend).hasResist).toBe(false);
//     await testEngine.exertCard(tobyTurtleWaryFriend);
//
//     expect(testEngine.getCardModel(tobyTurtleWaryFriend).hasResist).toBe(true);
//   });
// });
//
