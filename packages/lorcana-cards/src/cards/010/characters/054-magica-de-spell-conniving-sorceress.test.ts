// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   magicaDeSpellConnivingSorceress,
//   magicaDeSpellShadowyAndSinister,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Magica De Spell - Conniving Sorceress", () => {
//   it("should have Shift 7", () => {
//     const testEngine = new TestEngine({
//       play: [magicaDeSpellConnivingSorceress],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(
//       magicaDeSpellConnivingSorceress,
//     );
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it("SHADOW'S GRASP - Should draw 4 cards when played with Shift", async () => {
//     const testEngine = new TestEngine({
//       inkwell: magicaDeSpellConnivingSorceress.cost,
//       play: [magicaDeSpellShadowyAndSinister],
//       hand: [magicaDeSpellConnivingSorceress],
//       deck: 10,
//     });
//
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     // Shift Conniving Sorceress on top of Shadowy and Sinister
//     await testEngine.shiftCard({
//       shifted: magicaDeSpellShadowyAndSinister,
//       shifter: magicaDeSpellConnivingSorceress,
//     });
//
//     // Accept the optional ability
//     await testEngine.acceptOptionalAbility();
//
//     // Should have drawn 4 cards (1 initial + 4 drawn)
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(4);
//   });
//
//   it("SHADOW'S GRASP - Should be optional", async () => {
//     const testEngine = new TestEngine({
//       inkwell: magicaDeSpellConnivingSorceress.cost,
//       play: [magicaDeSpellShadowyAndSinister],
//       hand: [magicaDeSpellConnivingSorceress],
//       deck: 10,
//     });
//
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     // Shift Conniving Sorceress on top of Shadowy and Sinister
//     await testEngine.shiftCard({
//       shifted: magicaDeSpellShadowyAndSinister,
//       shifter: magicaDeSpellConnivingSorceress,
//     });
//
//     // Decline the optional ability
//     await testEngine.skipTopOfStack();
//
//     // Should not have drawn any cards (still 0 because shifted card went to play)
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//   });
//
//   it("SHADOW'S GRASP - Should NOT trigger when played normally (without Shift)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: magicaDeSpellConnivingSorceress.cost,
//       hand: [magicaDeSpellConnivingSorceress],
//       deck: 10,
//     });
//
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     // Play normally (not shifting)
//     await testEngine.playCard(magicaDeSpellConnivingSorceress);
//
//     // Should not have drawn any cards
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
