// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liShangNewlyPromoted } from "@lorcanito/lorcana-engine/cards/007/characters/characters";
// Import { mushuYourWorstNightmare } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mushu - Your Worst Nightmare", () => {
//   It("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mushu.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mushuYourWorstNightmare],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mushuYourWorstNightmare);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("ALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mushuYourWorstNightmare.cost + liShangNewlyPromoted.cost,
//       Hand: [mushuYourWorstNightmare, liShangNewlyPromoted],
//     });
//
//     Const targetCard = testEngine.getCardModel(liShangNewlyPromoted);
//     Const sourceCard = testEngine.getCardModel(mushuYourWorstNightmare);
//
//     Expect(targetCard.hasRush).toBe(false);
//     Expect(targetCard.hasReckless).toBe(false);
//     Expect(targetCard.hasEvasive).toBe(false);
//
//     Await testEngine.playCard(mushuYourWorstNightmare);
//     Await testEngine.playCard(liShangNewlyPromoted);
//
//     Expect(sourceCard.hasRush).toBe(false);
//     Expect(sourceCard.hasEvasive).toBe(false);
//     Expect(sourceCard.hasReckless).toBe(false);
//     Expect(targetCard.hasRush).toBe(true);
//     Expect(targetCard.hasEvasive).toBe(true);
//     Expect(targetCard.hasReckless).toBe(true);
//
//     Await testEngine.passTurn();
//
//     Expect(targetCard.hasRush).toBe(false);
//     Expect(targetCard.hasReckless).toBe(false);
//     Expect(targetCard.hasEvasive).toBe(false);
//   });
// });
//
