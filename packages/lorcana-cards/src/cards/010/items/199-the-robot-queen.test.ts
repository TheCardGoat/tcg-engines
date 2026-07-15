// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MauiDemiGod,
//   MickeyMouseWaywardSorcerer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { theRobotQueen } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Robot Queen", () => {
//   It("MAJOR MALFUNCTION - Triggers when you play a character and deals 2 damage", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mickeyMouseWaywardSorcerer.cost + 1, // 8 + 1 for ability cost
//         Play: [theRobotQueen],
//         Hand: [mickeyMouseWaywardSorcerer],
//       },
//       {
//         Play: [mauiDemiGod],
//       },
//     );
//
//     Const opponentMaui = testEngine.getCardModel(mauiDemiGod);
//
//     Expect(opponentMaui.damage).toBe(0);
//
//     // Play a character - this should trigger the ability
//     Await testEngine.playCard(mickeyMouseWaywardSorcerer);
//
//     // Accept the optional ability
//     Await testEngine.acceptOptionalAbility();
//
//     // Pay the cost and target opponent's character
//     Await testEngine.resolveTopOfStack({
//       Targets: [opponentMaui],
//     });
//
//     // Verify damage was dealt
//     Expect(opponentMaui.damage).toBe(2);
//
//     // Verify the item was banished
//     Expect(testEngine.getCardModel(theRobotQueen).zone).toBe("discard");
//   });
//
//   It("MAJOR MALFUNCTION - Can decline the optional ability", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mickeyMouseWaywardSorcerer.cost + 1,
//         Play: [theRobotQueen],
//         Hand: [mickeyMouseWaywardSorcerer],
//       },
//       {
//         Play: [mauiDemiGod],
//       },
//     );
//
//     Const opponentMaui = testEngine.getCardModel(mauiDemiGod);
//
//     // Play a character - this should trigger the ability
//     Await testEngine.playCard(mickeyMouseWaywardSorcerer);
//
//     // Skip the optional ability
//     Await testEngine.skipTopOfStack();
//
//     // Verify no damage was dealt
//     Expect(opponentMaui.damage).toBe(0);
//
//     // Verify the item was NOT banished
//     Expect(testEngine.getCardModel(theRobotQueen).zone).toBe("play");
//   });
// });
//
