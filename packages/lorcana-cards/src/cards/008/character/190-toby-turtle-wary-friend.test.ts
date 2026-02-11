// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tobyTurtleWaryFriend } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Toby Turtle - Wary Friend", () => {
//   It("HARD SHELL While this character is exerted, he gains Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: tobyTurtleWaryFriend.cost,
//       Play: [tobyTurtleWaryFriend],
//       Hand: [],
//     });
//
//     Expect(testEngine.getCardModel(tobyTurtleWaryFriend).hasResist).toBe(false);
//     Await testEngine.exertCard(tobyTurtleWaryFriend);
//
//     Expect(testEngine.getCardModel(tobyTurtleWaryFriend).hasResist).toBe(true);
//   });
// });
//
