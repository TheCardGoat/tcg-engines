// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/198-grab-your-sword";
// Import { powerlineMusicalSuperstar } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Powerline - Musical Superstar", () => {
//   It("ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: grabYourSword.cost,
//       Play: [powerlineMusicalSuperstar],
//       Hand: [grabYourSword],
//     });
//
//     Expect(testEngine.getCardModel(powerlineMusicalSuperstar).hasRush).toBe(
//       False,
//     );
//
//     Await testEngine.playCard(grabYourSword);
//
//     Expect(testEngine.getCardModel(powerlineMusicalSuperstar).hasRush).toBe(
//       True,
//     );
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(powerlineMusicalSuperstar).hasRush).toBe(
//       False,
//     );
//   });
// });
//
