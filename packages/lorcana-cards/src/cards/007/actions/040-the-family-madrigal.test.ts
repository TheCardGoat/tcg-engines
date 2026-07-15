// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloGalacticHero,
//   MickeyBraveLittleTailor,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   AgustinMadrigalClumsyDad,
//   AlmaMadrigalFamilyMatriarch,
//   MickeyMouseLeaderOfTheBand,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   DontLetTheFrostbiteBite,
//   TryEverything,
// } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { heffalumpsAndWoozles } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   TheFamilyMadrigal,
//   ThisIsMyFamily,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { hesATramp } from "@lorcanito/lorcana-engine/cards/007/actions/actions";
// Import { downInNewOrleans } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Family Madrigal", () => {
//   Describe("Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand.", () => {
//     Const deck = [
//       LiloGalacticHero,
//       MickeyBraveLittleTailor,
//       HesATramp,
//       AgustinMadrigalClumsyDad,
//       AlmaMadrigalFamilyMatriarch,
//       MickeyMouseTrueFriend,
//       MickeyMouseLeaderOfTheBand,
//     ];
//
//     It("Happy Case", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theFamilyMadrigal.cost,
//         Hand: [theFamilyMadrigal],
//         Deck: deck,
//       });
//
//       Await testEngine.playCard(theFamilyMadrigal, {
//         Scry: {
//           Hand: [agustinMadrigalClumsyDad, hesATramp],
//           Top: [
//             MickeyBraveLittleTailor,
//             MickeyMouseTrueFriend,
//             MickeyMouseLeaderOfTheBand,
//           ],
//         },
//       });
//
//       // Should have drawn both the Madrigal character and the song
//       Expect(testEngine.getCardModel(agustinMadrigalClumsyDad).zone).toBe(
//         "hand",
//       );
//       Expect(testEngine.getCardModel(hesATramp).zone).toBe("hand");
//       // The rest should remain on top
//       Expect(testEngine.getCardModel(mickeyBraveLittleTailor).zone).toBe(
//         "deck",
//       );
//     });
//
//     It("Choosing only one potential target", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theFamilyMadrigal.cost,
//         Hand: [theFamilyMadrigal],
//         Deck: deck,
//       });
//
//       Await testEngine.playCard(theFamilyMadrigal, {
//         Scry: {
//           Hand: [agustinMadrigalClumsyDad],
//           Top: [
//             MickeyBraveLittleTailor,
//             MickeyMouseTrueFriend,
//             MickeyMouseLeaderOfTheBand,
//             HesATramp,
//           ],
//         },
//       });
//
//       Expect(testEngine.getCardModel(agustinMadrigalClumsyDad).zone).toBe(
//         "hand",
//       );
//       Expect(testEngine.getCardModel(hesATramp).zone).toBe("deck");
//     });
//
//     It("Choosing one correct target and one incorrect", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theFamilyMadrigal.cost,
//         Hand: [theFamilyMadrigal],
//         Deck: deck,
//       });
//
//       Await testEngine.playCard(theFamilyMadrigal, {
//         Scry: {
//           Hand: [agustinMadrigalClumsyDad, mickeyBraveLittleTailor],
//           Top: [
//             MickeyBraveLittleTailor,
//             MickeyMouseTrueFriend,
//             MickeyMouseLeaderOfTheBand,
//             HesATramp,
//           ],
//         },
//       });
//
//       Expect(testEngine.getCardModel(agustinMadrigalClumsyDad).zone).toBe(
//         "hand",
//       );
//       Expect(testEngine.getCardModel(mickeyBraveLittleTailor).zone).toBe(
//         "deck",
//       );
//     });
//
//     It("choosing 2 songs", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theFamilyMadrigal.cost,
//         Hand: [theFamilyMadrigal],
//         Deck: [
//           HeffalumpsAndWoozles,
//           ThisIsMyFamily,
//           TryEverything,
//           DownInNewOrleans,
//           DontLetTheFrostbiteBite,
//         ],
//       });
//
//       Await testEngine.playCard(theFamilyMadrigal, {
//         Scry: {
//           Hand: [dontLetTheFrostbiteBite, downInNewOrleans],
//           Top: [heffalumpsAndWoozles, thisIsMyFamily, tryEverything],
//         },
//       });
//
//       Expect(testEngine.getCardModel(dontLetTheFrostbiteBite).zone).toBe(
//         "hand",
//       );
//       Expect(testEngine.getCardModel(downInNewOrleans).zone).toBe("deck");
//     });
//
//     It("Choosing more than they should", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theFamilyMadrigal.cost,
//         Hand: [theFamilyMadrigal],
//         Deck: deck,
//       });
//
//       Await testEngine.playCard(theFamilyMadrigal, {
//         Scry: {
//           Hand: [agustinMadrigalClumsyDad, almaMadrigalFamilyMatriarch],
//           Top: [
//             MickeyBraveLittleTailor,
//             MickeyMouseTrueFriend,
//             MickeyMouseLeaderOfTheBand,
//             HesATramp,
//           ],
//         },
//       });
//
//       Expect(testEngine.getCardModel(agustinMadrigalClumsyDad).zone).toBe(
//         "hand",
//       );
//       Expect(testEngine.getCardModel(almaMadrigalFamilyMatriarch).zone).toBe(
//         "deck",
//       );
//     });
//   });
// });
//
