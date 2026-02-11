// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielSpectacularSinger,
//   MickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { liloEscapeArtist } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   BoltSuperdog,
//   GiantCobraGhostlySerpent,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bolt - Superdog", () => {
//   It("Shift 3", async () => {
//     Const testEngine = new TestEngine({
//       Play: [boltSuperdog],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(boltSuperdog);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   Describe("MARK OF POWER", () => {
//     It("When you ready this character, gain 1 lore for each other undamaged character you have in play.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: boltSuperdog.cost,
//         Play: [boltSuperdog, arielSpectacularSinger, mickeyBraveLittleTailor],
//       });
//
//       Await testEngine.questCard(boltSuperdog);
//       Expect(testEngine.getPlayerLore()).toEqual(2);
//
//       Await testEngine.tapCard(boltSuperdog, true);
//
//       Await testEngine.acceptOptionalLayer();
//
//       Expect(testEngine.getPlayerLore()).toEqual(4);
//     });
//
//     It("When you ready this character, gain 1 lore for each other undamaged character you have in play. (damaged characters not counted)", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: boltSuperdog.cost,
//         Play: [boltSuperdog, arielSpectacularSinger, mickeyBraveLittleTailor],
//         Hand: [],
//       });
//
//       Await testEngine.questCard(boltSuperdog);
//       Expect(testEngine.getPlayerLore()).toEqual(2);
//
//       Await testEngine.setCardDamage(arielSpectacularSinger, 1);
//       Await testEngine.setCardDamage(mickeyBraveLittleTailor, 1);
//
//       Await testEngine.tapCard(boltSuperdog, true);
//
//       Expect(testEngine.getPlayerLore()).toEqual(2);
//     });
//   });
//
//   Describe("BOLT STARE", () => {
//     It("Banish chosen Illusion character.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: boltSuperdog.cost,
//           Play: [boltSuperdog],
//         },
//         {
//           Play: [giantCobraGhostlySerpent],
//         },
//       );
//
//       Await testEngine.activateCard(boltSuperdog);
//       Await testEngine.resolveTopOfStack({
//         Targets: [giantCobraGhostlySerpent],
//       });
//
//       Expect(testEngine.getCardZone(giantCobraGhostlySerpent)).toEqual(
//         "discard",
//       );
//     });
//
//     It("Cannot banish a character that is not an illusion.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: boltSuperdog.cost,
//           Play: [boltSuperdog],
//         },
//         {
//           Play: [arielSpectacularSinger],
//         },
//       );
//
//       Await testEngine.activateCard(boltSuperdog); // no valid targets
//
//       Expect(testEngine.stackLayers.length).toEqual(0);
//     });
//   });
// });
//
// Describe("Regression tests", () => {
//   It("We should add effect to the bag even when there's no undamaged character", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: liloEscapeArtist.cost,
//         Play: [boltSuperdog],
//         Discard: [liloEscapeArtist],
//         Deck: 2,
//       },
//       {
//         Deck: 2,
//       },
//     );
//
//     Await testEngine.tapCard(boltSuperdog);
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Expect(testEngine.stackLayers).toHaveLength(2);
//     Await testEngine.acceptOptionalLayerBySource({
//       SkipAssertion: true,
//       Source: liloEscapeArtist,
//     });
//     Expect(testEngine.getCardModel(liloEscapeArtist).zone).toBe("play");
//
//     Expect(testEngine.getPlayerLore()).toBe(0);
//     Await testEngine.acceptOptionalLayerBySource({
//       Source: boltSuperdog,
//     });
//
//     Expect(testEngine.getPlayerLore()).toBe(1);
//   });
// });
//
