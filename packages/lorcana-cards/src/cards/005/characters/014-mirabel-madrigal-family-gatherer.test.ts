// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AgustinMadrigalClumsyDad,
//   AntonioMadrigalAnimalExpert,
//   CamiloMadrigalPrankster,
//   DoloresMadrigalEasyListener,
//   JulietaMadrigalExcellentCook,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { mirabelMadrigalFamilyGatherer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mirabel Madrigal - Family Gatherer", () => {
//   Describe("**NOT WITHOUT MY FAMILY** You can’t play this character unless you have 5 or more characters in play.", () => {
//     It("Can't be played with fewer than 5 characters in play", () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mirabelMadrigalFamilyGatherer.cost,
//         Hand: [mirabelMadrigalFamilyGatherer],
//         Play: [],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MirabelMadrigalFamilyGatherer,
//       );
//       TestEngine.playCard(mirabelMadrigalFamilyGatherer);
//       Expect(cardUnderTest.zone).toEqual("hand");
//     });
//
//     It("Can be played with 5 or more characters in play", () => {
//       Const testEngine = new TestEngine({
//         Inkwell: mirabelMadrigalFamilyGatherer.cost,
//         Hand: [mirabelMadrigalFamilyGatherer],
//         Play: [
//           AgustinMadrigalClumsyDad,
//           CamiloMadrigalPrankster,
//           AntonioMadrigalAnimalExpert,
//           DoloresMadrigalEasyListener,
//           JulietaMadrigalExcellentCook,
//         ],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MirabelMadrigalFamilyGatherer,
//       );
//
//       TestEngine.playCard(mirabelMadrigalFamilyGatherer);
//       Expect(cardUnderTest.zone).toEqual("play");
//     });
//   });
// });
//
