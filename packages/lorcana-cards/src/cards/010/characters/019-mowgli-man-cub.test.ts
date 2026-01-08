// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import {
//   mauiHalfshark,
//   sailTheAzuriteSea,
// } from "@lorcanito/lorcana-engine/cards/006";
// import { mowgliManCub } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mowgli - Man Cub", () => {
//   describe("HAVE A BETTER LOOK", () => {
//     it("When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: mowgliManCub.cost,
//           hand: [mowgliManCub],
//         },
//         {
//           hand: [bePrepared, sailTheAzuriteSea, mauiHalfshark],
//         },
//       );
//
//       const actionCard = testEngine.getCardModel(bePrepared);
//       expect(actionCard.zone).toBe("hand");
//       expect(testEngine.getCardsByZone("hand", "player_two").length).toBe(3);
//
//       await testEngine.playCard(mowgliManCub);
//
//       await testEngine.acceptOptionalLayer();
//       // Opponent's hand should be revealed
//       expect(
//         testEngine
//           .getCardsByZone("hand", "player_two")
//           .every((card) => card.isRevealed),
//       ).toBe(true);
//
//       // Switch to opponent's perspective (they make the choice)
//       testEngine.testStore.changePlayer("player_two");
//       await testEngine.resolveTopOfStack({ targets: [actionCard] });
//
//       // Switch back to original player
//       testEngine.testStore.changePlayer("player_one");
//
//       // Action card should be discarded (opponent chose to discard it)
//       expect(actionCard.zone).toBe("discard");
//
//       // Character card should still be in hand (opponent cannot discard character cards with this ability)
//       const characterCard = testEngine.getCardModel(mauiHalfshark);
//       expect(characterCard.zone).toBe("hand");
//     });
//   });
// });
//
