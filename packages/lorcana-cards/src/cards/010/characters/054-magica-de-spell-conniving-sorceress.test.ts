// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MagicaDeSpellConnivingSorceress,
//   MagicaDeSpellShadowyAndSinister,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Magica De Spell - Conniving Sorceress", () => {
//   It("should have Shift 7", () => {
//     Const testEngine = new TestEngine({
//       Play: [magicaDeSpellConnivingSorceress],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       MagicaDeSpellConnivingSorceress,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("SHADOW'S GRASP - Should draw 4 cards when played with Shift", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: magicaDeSpellConnivingSorceress.cost,
//       Play: [magicaDeSpellShadowyAndSinister],
//       Hand: [magicaDeSpellConnivingSorceress],
//       Deck: 10,
//     });
//
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     // Shift Conniving Sorceress on top of Shadowy and Sinister
//     Await testEngine.shiftCard({
//       Shifted: magicaDeSpellShadowyAndSinister,
//       Shifter: magicaDeSpellConnivingSorceress,
//     });
//
//     // Accept the optional ability
//     Await testEngine.acceptOptionalAbility();
//
//     // Should have drawn 4 cards (1 initial + 4 drawn)
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(4);
//   });
//
//   It("SHADOW'S GRASP - Should be optional", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: magicaDeSpellConnivingSorceress.cost,
//       Play: [magicaDeSpellShadowyAndSinister],
//       Hand: [magicaDeSpellConnivingSorceress],
//       Deck: 10,
//     });
//
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     // Shift Conniving Sorceress on top of Shadowy and Sinister
//     Await testEngine.shiftCard({
//       Shifted: magicaDeSpellShadowyAndSinister,
//       Shifter: magicaDeSpellConnivingSorceress,
//     });
//
//     // Decline the optional ability
//     Await testEngine.skipTopOfStack();
//
//     // Should not have drawn any cards (still 0 because shifted card went to play)
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//   });
//
//   It("SHADOW'S GRASP - Should NOT trigger when played normally (without Shift)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: magicaDeSpellConnivingSorceress.cost,
//       Hand: [magicaDeSpellConnivingSorceress],
//       Deck: 10,
//     });
//
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     // Play normally (not shifting)
//     Await testEngine.playCard(magicaDeSpellConnivingSorceress);
//
//     // Should not have drawn any cards
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     Expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
