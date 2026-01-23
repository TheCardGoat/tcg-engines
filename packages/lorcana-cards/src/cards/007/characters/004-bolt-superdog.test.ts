// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   arielSpectacularSinger,
//   mickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { liloEscapeArtist } from "@lorcanito/lorcana-engine/cards/006";
// import {
//   boltSuperdog,
//   giantCobraGhostlySerpent,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bolt - Superdog", () => {
//   it("Shift 3", async () => {
//     const testEngine = new TestEngine({
//       play: [boltSuperdog],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(boltSuperdog);
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   describe("MARK OF POWER", () => {
//     it("When you ready this character, gain 1 lore for each other undamaged character you have in play.", async () => {
//       const testEngine = new TestEngine({
//         inkwell: boltSuperdog.cost,
//         play: [boltSuperdog, arielSpectacularSinger, mickeyBraveLittleTailor],
//       });
//
//       await testEngine.questCard(boltSuperdog);
//       expect(testEngine.getPlayerLore()).toEqual(2);
//
//       await testEngine.tapCard(boltSuperdog, true);
//
//       await testEngine.acceptOptionalLayer();
//
//       expect(testEngine.getPlayerLore()).toEqual(4);
//     });
//
//     it("When you ready this character, gain 1 lore for each other undamaged character you have in play. (damaged characters not counted)", async () => {
//       const testEngine = new TestEngine({
//         inkwell: boltSuperdog.cost,
//         play: [boltSuperdog, arielSpectacularSinger, mickeyBraveLittleTailor],
//         hand: [],
//       });
//
//       await testEngine.questCard(boltSuperdog);
//       expect(testEngine.getPlayerLore()).toEqual(2);
//
//       await testEngine.setCardDamage(arielSpectacularSinger, 1);
//       await testEngine.setCardDamage(mickeyBraveLittleTailor, 1);
//
//       await testEngine.tapCard(boltSuperdog, true);
//
//       expect(testEngine.getPlayerLore()).toEqual(2);
//     });
//   });
//
//   describe("BOLT STARE", () => {
//     it("Banish chosen Illusion character.", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: boltSuperdog.cost,
//           play: [boltSuperdog],
//         },
//         {
//           play: [giantCobraGhostlySerpent],
//         },
//       );
//
//       await testEngine.activateCard(boltSuperdog);
//       await testEngine.resolveTopOfStack({
//         targets: [giantCobraGhostlySerpent],
//       });
//
//       expect(testEngine.getCardZone(giantCobraGhostlySerpent)).toEqual(
//         "discard",
//       );
//     });
//
//     it("Cannot banish a character that is not an illusion.", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: boltSuperdog.cost,
//           play: [boltSuperdog],
//         },
//         {
//           play: [arielSpectacularSinger],
//         },
//       );
//
//       await testEngine.activateCard(boltSuperdog); // no valid targets
//
//       expect(testEngine.stackLayers.length).toEqual(0);
//     });
//   });
// });
//
// describe("Regression tests", () => {
//   it("We should add effect to the bag even when there's no undamaged character", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: liloEscapeArtist.cost,
//         play: [boltSuperdog],
//         discard: [liloEscapeArtist],
//         deck: 2,
//       },
//       {
//         deck: 2,
//       },
//     );
//
//     await testEngine.tapCard(boltSuperdog);
//
//     await testEngine.passTurn();
//     await testEngine.passTurn();
//
//     expect(testEngine.stackLayers).toHaveLength(2);
//     await testEngine.acceptOptionalLayerBySource({
//       skipAssertion: true,
//       source: liloEscapeArtist,
//     });
//     expect(testEngine.getCardModel(liloEscapeArtist).zone).toBe("play");
//
//     expect(testEngine.getPlayerLore()).toBe(0);
//     await testEngine.acceptOptionalLayerBySource({
//       source: boltSuperdog,
//     });
//
//     expect(testEngine.getPlayerLore()).toBe(1);
//   });
// });
//
