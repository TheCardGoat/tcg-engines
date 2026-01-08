// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   basilTenaciousMouse,
//   lenaSabrewingMysteriousDuck,
//   megaraSecretKeeper,
//   mickeyMouseDetective,
//   scarEerilyPrepared,
//   theBlackCauldron,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lena Sabrewing - Mysterious Duck", () => {
//   describe("ARCANE CONNECTION - Gain lore when playing if card is under another card", () => {
//     it("should gain 1 lore when played if you have a character with a card under it", async () => {
//       const testEngine = new TestEngine({
//         inkwell: lenaSabrewingMysteriousDuck.cost + 5,
//         hand: [lenaSabrewingMysteriousDuck],
//         play: [megaraSecretKeeper],
//         deck: [basilTenaciousMouse, mickeyMouseDetective],
//       });
//
//       // First, put a card under Megara Secret Keeper using her boost ability
//       await testEngine.activateCard(megaraSecretKeeper);
//
//       // Verify Megara has a card under her
//       const megara = testEngine.getCardModel(megaraSecretKeeper);
//       expect(megara.cardsUnder).toHaveLength(1);
//
//       const initialLore = testEngine.getLoreForPlayer("player_one");
//
//       // Play Lena Sabrewing
//       await testEngine.playCard(lenaSabrewingMysteriousDuck);
//
//       const finalLore = testEngine.getLoreForPlayer("player_one");
//
//       expect(finalLore).toBe(initialLore + 1);
//     });
//
//     it("should NOT gain 1 lore when played if you have no character with a card under it", async () => {
//       const testEngine = new TestEngine({
//         inkwell: lenaSabrewingMysteriousDuck.cost + 5,
//         hand: [lenaSabrewingMysteriousDuck],
//         play: [megaraSecretKeeper],
//         deck: [basilTenaciousMouse, mickeyMouseDetective],
//       });
//
//       // Don't put any cards under Megara
//       const megara = testEngine.getCardModel(megaraSecretKeeper);
//       expect(megara.cardsUnder).toHaveLength(0);
//
//       const initialLore = testEngine.getLoreForPlayer("player_one");
//
//       // Play Lena Sabrewing
//       await testEngine.playCard(lenaSabrewingMysteriousDuck);
//
//       const finalLore = testEngine.getLoreForPlayer("player_one");
//
//       expect(finalLore).toBe(initialLore);
//     });
//
//     it("should work when there are multiple cards in the deck to boost", async () => {
//       const testEngine = new TestEngine({
//         inkwell: lenaSabrewingMysteriousDuck.cost + 5,
//         hand: [lenaSabrewingMysteriousDuck],
//         play: [megaraSecretKeeper],
//         deck: [basilTenaciousMouse, mickeyMouseDetective, scarEerilyPrepared],
//       });
//
//       // Put a card under Megara (there are multiple cards in deck to choose from)
//       await testEngine.activateCard(megaraSecretKeeper);
//
//       // Verify Megara has a card under her
//       const megara = testEngine.getCardModel(megaraSecretKeeper);
//       expect(megara.cardsUnder).toHaveLength(1);
//
//       const initialLore = testEngine.getLoreForPlayer("player_one");
//
//       // Play Lena Sabrewing
//       await testEngine.playCard(lenaSabrewingMysteriousDuck);
//
//       const finalLore = testEngine.getLoreForPlayer("player_one");
//
//       expect(finalLore).toBe(initialLore + 1);
//     });
//   });
// });
//
