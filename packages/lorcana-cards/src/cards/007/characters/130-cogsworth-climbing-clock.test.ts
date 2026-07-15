// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { cogsworthClimbingClock } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cogsworth - Climbing Clock", () => {
//   It("STILL USEFUL While you have an item card in your discard, this character gets +2 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [cogsworthClimbingClock],
//       Discard: [dingleHopper],
//     });
//
//     Await testEngine.playCard(cogsworthClimbingClock);
//
//     Expect(testEngine.getCardModel(cogsworthClimbingClock).strength).toBe(
//       CogsworthClimbingClock.strength + 2,
//     );
//   });
//
//   It("No item in discard", async () => {
//     Const testEngine = new TestEngine({
//       Play: [cogsworthClimbingClock],
//     });
//
//     Await testEngine.playCard(cogsworthClimbingClock);
//
//     Expect(testEngine.getCardModel(cogsworthClimbingClock).strength).toBe(
//       CogsworthClimbingClock.strength,
//     );
//   });
// });
//
