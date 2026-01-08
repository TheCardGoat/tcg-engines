// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// import { mickeyMouseGiantMouse } from "@lorcanito/lorcana-engine/cards/008/characters/characters";
// import { jasmineSoothingPrincess } from "@lorcanito/lorcana-engine/cards/010/characters/149-jasmine-soothing-princess";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Jasmine - Soothing Princess", () => {
//   it("has Boost 2 ability", async () => {
//     const testEngine = new TestEngine({
//       play: [jasmineSoothingPrincess],
//     });
//
//     expect(testEngine.getCardModel(jasmineSoothingPrincess).hasBoost).toBe(
//       true,
//     );
//   });
//
//   describe("UPLIFTING AURA - Whenever this character quests, if there's a card under her, remove up to 3 damage from each of your characters.", async () => {
//     it("Boosted", async () => {
//       const cardsInPlay = [
//         jasmineSoothingPrincess,
//         goofyKnightForADay,
//         mickeyMouseGiantMouse,
//       ];
//       const testEngine = new TestEngine({
//         play: cardsInPlay,
//         inkwell: 2, // For boosting
//       });
//
//       const cardUnderTest = testEngine.getCardModel(jasmineSoothingPrincess);
//       await testEngine.activateCard(jasmineSoothingPrincess);
//       expect(cardUnderTest.boostBonus).toEqual(1);
//
//       for (const card of cardsInPlay) {
//         await testEngine.setCardDamage(card, 4);
//       }
//
//       await testEngine.questCard(jasmineSoothingPrincess);
//
//       for (const card of cardsInPlay) {
//         expect(testEngine.getCardModel(card).damage).toEqual(1);
//       }
//     });
//
//     it("NOT boosted", async () => {
//       const cardsInPlay = [
//         jasmineSoothingPrincess,
//         goofyKnightForADay,
//         mickeyMouseGiantMouse,
//       ];
//       const testEngine = new TestEngine({
//         play: cardsInPlay,
//         inkwell: 2, // For boosting
//       });
//
//       const cardUnderTest = testEngine.getCardModel(jasmineSoothingPrincess);
//       expect(cardUnderTest.boostBonus).toEqual(0);
//
//       for (const card of cardsInPlay) {
//         await testEngine.setCardDamage(card, 4);
//       }
//
//       await testEngine.questCard(jasmineSoothingPrincess);
//
//       for (const card of cardsInPlay) {
//         expect(testEngine.getCardModel(card).damage).toEqual(4);
//       }
//     });
//   });
// });
//
