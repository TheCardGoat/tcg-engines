// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/198-grab-your-sword";
// import { powerlineMusicalSuperstar } from "@lorcanito/lorcana-engine/cards/009";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Powerline - Musical Superstar", () => {
//   it("ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: grabYourSword.cost,
//       play: [powerlineMusicalSuperstar],
//       hand: [grabYourSword],
//     });
//
//     expect(testEngine.getCardModel(powerlineMusicalSuperstar).hasRush).toBe(
//       false,
//     );
//
//     await testEngine.playCard(grabYourSword);
//
//     expect(testEngine.getCardModel(powerlineMusicalSuperstar).hasRush).toBe(
//       true,
//     );
//
//     await testEngine.passTurn();
//
//     expect(testEngine.getCardModel(powerlineMusicalSuperstar).hasRush).toBe(
//       false,
//     );
//   });
// });
//
