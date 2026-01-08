// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   stichtCarefreeSurfer,
//   stichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   aladdinBraveRescuer,
//   pegasusCloudRacer,
//   pegasusGiftForHercules,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import {
//   kronkHeadOfSecurity,
//   liloJuniorCakeDecorator,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pegasus - Cloud Racer", () => {
//   describe("Regression", () => {
//     it("Playing a new character should not cancel the effect on existing characters", async () => {
//       const cardsInPlay = [aladdinBraveRescuer, kronkHeadOfSecurity];
//       const testEngine = new TestEngine(
//         {
//           inkwell: pegasusCloudRacer.cost + liloJuniorCakeDecorator.cost,
//           hand: [pegasusCloudRacer, liloJuniorCakeDecorator],
//           play: [...cardsInPlay, pegasusGiftForHercules],
//         },
//         {
//           inkwell: stichtNewDog.cost,
//           hand: [stichtNewDog, stichtCarefreeSurfer],
//         },
//       );
//
//       cardsInPlay.forEach((card) => {
//         expect(testEngine.getCardModel(card).hasEvasive).toBe(false);
//       });
//
//       await testEngine.shiftCard({
//         shifter: pegasusCloudRacer,
//         shifted: pegasusGiftForHercules,
//       });
//
//       cardsInPlay.forEach((card) => {
//         expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
//       });
//
//       await testEngine.playCard(liloJuniorCakeDecorator);
//
//       cardsInPlay.forEach((card) => {
//         expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
//       });
//
//       await testEngine.passTurn();
//
//       cardsInPlay.forEach((card) => {
//         expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
//       });
//
//       await testEngine.playCard(stichtNewDog);
//       await testEngine.putIntoInkwell(stichtCarefreeSurfer);
//
//       cardsInPlay.forEach((card) => {
//         expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
//       });
//     });
//   });
// });
//
