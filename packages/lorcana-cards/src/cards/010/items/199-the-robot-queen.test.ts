// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mauiDemiGod,
//   mickeyMouseWaywardSorcerer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { theRobotQueen } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Robot Queen", () => {
//   it("MAJOR MALFUNCTION - Triggers when you play a character and deals 2 damage", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: mickeyMouseWaywardSorcerer.cost + 1, // 8 + 1 for ability cost
//         play: [theRobotQueen],
//         hand: [mickeyMouseWaywardSorcerer],
//       },
//       {
//         play: [mauiDemiGod],
//       },
//     );
//
//     const opponentMaui = testEngine.getCardModel(mauiDemiGod);
//
//     expect(opponentMaui.damage).toBe(0);
//
//     // Play a character - this should trigger the ability
//     await testEngine.playCard(mickeyMouseWaywardSorcerer);
//
//     // Accept the optional ability
//     await testEngine.acceptOptionalAbility();
//
//     // Pay the cost and target opponent's character
//     await testEngine.resolveTopOfStack({
//       targets: [opponentMaui],
//     });
//
//     // Verify damage was dealt
//     expect(opponentMaui.damage).toBe(2);
//
//     // Verify the item was banished
//     expect(testEngine.getCardModel(theRobotQueen).zone).toBe("discard");
//   });
//
//   it("MAJOR MALFUNCTION - Can decline the optional ability", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: mickeyMouseWaywardSorcerer.cost + 1,
//         play: [theRobotQueen],
//         hand: [mickeyMouseWaywardSorcerer],
//       },
//       {
//         play: [mauiDemiGod],
//       },
//     );
//
//     const opponentMaui = testEngine.getCardModel(mauiDemiGod);
//
//     // Play a character - this should trigger the ability
//     await testEngine.playCard(mickeyMouseWaywardSorcerer);
//
//     // Skip the optional ability
//     await testEngine.skipTopOfStack();
//
//     // Verify no damage was dealt
//     expect(opponentMaui.damage).toBe(0);
//
//     // Verify the item was NOT banished
//     expect(testEngine.getCardModel(theRobotQueen).zone).toBe("play");
//   });
// });
//
