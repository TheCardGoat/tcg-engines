// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MammaOdieLoneSage,
//   SugarRushSpeedwayFinishLine,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   DownInNewOrleans,
//   KhanWarHorse,
//   LightTheFuse,
//   MickeyMouseGiantMouse,
//   StoppedChaosInItsTracks,
//   TelevisionSet,
//   TianaNaturalTalent,
//   WalkThePlank,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Down In New Orleans", () => {
//   It("Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: downInNewOrleans.cost,
//       Hand: [downInNewOrleans],
//       Deck: [khanWarHorse, televisionSet, sugarRushSpeedwayFinishLine],
//     });
//
//     Await testEngine.playCard(downInNewOrleans, {
//       Scry: {
//         Play: [sugarRushSpeedwayFinishLine],
//         Bottom: [khanWarHorse, televisionSet],
//       },
//     });
//
//     Expect(testEngine.getCardModel(khanWarHorse).zone).toBe("deck");
//     Expect(testEngine.getCardModel(televisionSet).zone).toBe("deck");
//     Expect(testEngine.getCardModel(sugarRushSpeedwayFinishLine).zone).toBe(
//       "play",
//     );
//   });
//
//   It("Playing a character", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: downInNewOrleans.cost,
//       Hand: [downInNewOrleans],
//       Deck: [khanWarHorse, televisionSet, sugarRushSpeedwayFinishLine],
//     });
//
//     Await testEngine.playCard(downInNewOrleans, {
//       Scry: {
//         Play: [khanWarHorse],
//         Bottom: [sugarRushSpeedwayFinishLine, televisionSet],
//       },
//     });
//
//     Expect(testEngine.getCardModel(khanWarHorse).zone).toBe("play");
//     Expect(testEngine.getCardModel(khanWarHorse).ready).toBe(true);
//   });
// });
//
// Describe("Regression tests", () => {
//   It("Should not crash when playing Down In New Orleans with no valid cards", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: downInNewOrleans.cost,
//         Hand: [downInNewOrleans],
//         Play: [tianaNaturalTalent, mammaOdieLoneSage],
//         Deck: [lightTheFuse, walkThePlank, stoppedChaosInItsTracks],
//       },
//       {
//         Play: [mickeyMouseMusketeer, mickeyMouseGiantMouse],
//       },
//     );
//
//     Await testEngine.playCard(downInNewOrleans);
//
//     // expect(testEngine.stackLayers).toHaveLength(3);
//     // await testEngine.acceptOptionalLayerBySource({
//     //   skipAssertion: true,
//     //   source: tianaNaturalTalent,
//     // });
//     // expect(testEngine.stackLayers).toHaveLength(3);
//     // await testEngine.acceptOptionalLayerBySource({
//     //   skipAssertion: true,
//     //   source: mammaOdieLoneSage,
//     // });
//     Expect(testEngine.stackLayers).toHaveLength(3);
//     Await testEngine.resolveStackLayer(
//       {
//         LayerId: testEngine.stackLayers.find(
//           (layer) =>
//             Layer.source.name.toLowerCase() ===
//             "Down In New Orleans".toLowerCase(),
//         )?.id,
//         Scry: {
//           Play: [],
//           Bottom: [lightTheFuse, walkThePlank, stoppedChaosInItsTracks],
//         },
//       },
//       True,
//     );
//     Expect(testEngine.stackLayers).toHaveLength(2);
//
//     Expect(testEngine.getCardModel(lightTheFuse).zone).toBe("deck");
//     Expect(testEngine.getCardModel(walkThePlank).zone).toBe("deck");
//     Expect(testEngine.getCardModel(stoppedChaosInItsTracks).zone).toBe("deck");
//   });
// });
//
