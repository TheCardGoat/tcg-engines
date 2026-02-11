// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   StichtCarefreeSurfer,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   AladdinBraveRescuer,
//   PegasusCloudRacer,
//   PegasusGiftForHercules,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   KronkHeadOfSecurity,
//   LiloJuniorCakeDecorator,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pegasus - Cloud Racer", () => {
//   Describe("Regression", () => {
//     It("Playing a new character should not cancel the effect on existing characters", async () => {
//       Const cardsInPlay = [aladdinBraveRescuer, kronkHeadOfSecurity];
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: pegasusCloudRacer.cost + liloJuniorCakeDecorator.cost,
//           Hand: [pegasusCloudRacer, liloJuniorCakeDecorator],
//           Play: [...cardsInPlay, pegasusGiftForHercules],
//         },
//         {
//           Inkwell: stichtNewDog.cost,
//           Hand: [stichtNewDog, stichtCarefreeSurfer],
//         },
//       );
//
//       CardsInPlay.forEach((card) => {
//         Expect(testEngine.getCardModel(card).hasEvasive).toBe(false);
//       });
//
//       Await testEngine.shiftCard({
//         Shifter: pegasusCloudRacer,
//         Shifted: pegasusGiftForHercules,
//       });
//
//       CardsInPlay.forEach((card) => {
//         Expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
//       });
//
//       Await testEngine.playCard(liloJuniorCakeDecorator);
//
//       CardsInPlay.forEach((card) => {
//         Expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
//       });
//
//       Await testEngine.passTurn();
//
//       CardsInPlay.forEach((card) => {
//         Expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
//       });
//
//       Await testEngine.playCard(stichtNewDog);
//       Await testEngine.putIntoInkwell(stichtCarefreeSurfer);
//
//       CardsInPlay.forEach((card) => {
//         Expect(testEngine.getCardModel(card).hasEvasive).toBe(true);
//       });
//     });
//   });
// });
//
