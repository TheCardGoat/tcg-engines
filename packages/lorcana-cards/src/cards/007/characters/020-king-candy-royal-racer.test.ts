// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BeastFrustratedDesigner,
//   CalhounCourageousRescuer,
//   KingCandyRoyalRacer,
//   LiShangNewlyPromoted,
//   OutOfOrder,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("King Candy - Royal Racer", () => {
//   It("SWEET REVENGE Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: outOfOrder.cost,
//         Play: [kingCandyRoyalRacer, calhounCourageousRescuer],
//         Hand: [outOfOrder],
//       },
//       {
//         Play: [liShangNewlyPromoted, beastFrustratedDesigner],
//       },
//     );
//
//     Await testEngine.playCard(
//       OutOfOrder,
//       {
//         Targets: [calhounCourageousRescuer],
//       },
//       True,
//     );
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveTopOfStack({ targets: [liShangNewlyPromoted] });
//
//     Expect(testEngine.getCardModel(liShangNewlyPromoted).zone).toBe("discard");
//   });
// });
//
