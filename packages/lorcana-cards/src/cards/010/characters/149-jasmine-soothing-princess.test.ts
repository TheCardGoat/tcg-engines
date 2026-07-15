// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import { mickeyMouseGiantMouse } from "@lorcanito/lorcana-engine/cards/008/characters/characters";
// Import { jasmineSoothingPrincess } from "@lorcanito/lorcana-engine/cards/010/characters/149-jasmine-soothing-princess";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jasmine - Soothing Princess", () => {
//   It("has Boost 2 ability", async () => {
//     Const testEngine = new TestEngine({
//       Play: [jasmineSoothingPrincess],
//     });
//
//     Expect(testEngine.getCardModel(jasmineSoothingPrincess).hasBoost).toBe(
//       True,
//     );
//   });
//
//   Describe("UPLIFTING AURA - Whenever this character quests, if there's a card under her, remove up to 3 damage from each of your characters.", async () => {
//     It("Boosted", async () => {
//       Const cardsInPlay = [
//         JasmineSoothingPrincess,
//         GoofyKnightForADay,
//         MickeyMouseGiantMouse,
//       ];
//       Const testEngine = new TestEngine({
//         Play: cardsInPlay,
//         Inkwell: 2, // For boosting
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(jasmineSoothingPrincess);
//       Await testEngine.activateCard(jasmineSoothingPrincess);
//       Expect(cardUnderTest.boostBonus).toEqual(1);
//
//       For (const card of cardsInPlay) {
//         Await testEngine.setCardDamage(card, 4);
//       }
//
//       Await testEngine.questCard(jasmineSoothingPrincess);
//
//       For (const card of cardsInPlay) {
//         Expect(testEngine.getCardModel(card).damage).toEqual(1);
//       }
//     });
//
//     It("NOT boosted", async () => {
//       Const cardsInPlay = [
//         JasmineSoothingPrincess,
//         GoofyKnightForADay,
//         MickeyMouseGiantMouse,
//       ];
//       Const testEngine = new TestEngine({
//         Play: cardsInPlay,
//         Inkwell: 2, // For boosting
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(jasmineSoothingPrincess);
//       Expect(cardUnderTest.boostBonus).toEqual(0);
//
//       For (const card of cardsInPlay) {
//         Await testEngine.setCardDamage(card, 4);
//       }
//
//       Await testEngine.questCard(jasmineSoothingPrincess);
//
//       For (const card of cardsInPlay) {
//         Expect(testEngine.getCardModel(card).damage).toEqual(4);
//       }
//     });
//   });
// });
//
