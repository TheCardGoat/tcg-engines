// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   MauiHalfshark,
//   SailTheAzuriteSea,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { mowgliManCub } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mowgli - Man Cub", () => {
//   Describe("HAVE A BETTER LOOK", () => {
//     It("When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: mowgliManCub.cost,
//           Hand: [mowgliManCub],
//         },
//         {
//           Hand: [bePrepared, sailTheAzuriteSea, mauiHalfshark],
//         },
//       );
//
//       Const actionCard = testEngine.getCardModel(bePrepared);
//       Expect(actionCard.zone).toBe("hand");
//       Expect(testEngine.getCardsByZone("hand", "player_two").length).toBe(3);
//
//       Await testEngine.playCard(mowgliManCub);
//
//       Await testEngine.acceptOptionalLayer();
//       // Opponent's hand should be revealed
//       Expect(
//         TestEngine
//           .getCardsByZone("hand", "player_two")
//           .every((card) => card.isRevealed),
//       ).toBe(true);
//
//       // Switch to opponent's perspective (they make the choice)
//       TestEngine.testStore.changePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ targets: [actionCard] });
//
//       // Switch back to original player
//       TestEngine.testStore.changePlayer("player_one");
//
//       // Action card should be discarded (opponent chose to discard it)
//       Expect(actionCard.zone).toBe("discard");
//
//       // Character card should still be in hand (opponent cannot discard character cards with this ability)
//       Const characterCard = testEngine.getCardModel(mauiHalfshark);
//       Expect(characterCard.zone).toBe("hand");
//     });
//   });
// });
//
