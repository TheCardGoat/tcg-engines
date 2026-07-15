// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BasilTenaciousMouse,
//   LenaSabrewingMysteriousDuck,
//   MegaraSecretKeeper,
//   MickeyMouseDetective,
//   ScarEerilyPrepared,
//   TheBlackCauldron,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lena Sabrewing - Mysterious Duck", () => {
//   Describe("ARCANE CONNECTION - Gain lore when playing if card is under another card", () => {
//     It("should gain 1 lore when played if you have a character with a card under it", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: lenaSabrewingMysteriousDuck.cost + 5,
//         Hand: [lenaSabrewingMysteriousDuck],
//         Play: [megaraSecretKeeper],
//         Deck: [basilTenaciousMouse, mickeyMouseDetective],
//       });
//
//       // First, put a card under Megara Secret Keeper using her boost ability
//       Await testEngine.activateCard(megaraSecretKeeper);
//
//       // Verify Megara has a card under her
//       Const megara = testEngine.getCardModel(megaraSecretKeeper);
//       Expect(megara.cardsUnder).toHaveLength(1);
//
//       Const initialLore = testEngine.getLoreForPlayer("player_one");
//
//       // Play Lena Sabrewing
//       Await testEngine.playCard(lenaSabrewingMysteriousDuck);
//
//       Const finalLore = testEngine.getLoreForPlayer("player_one");
//
//       Expect(finalLore).toBe(initialLore + 1);
//     });
//
//     It("should NOT gain 1 lore when played if you have no character with a card under it", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: lenaSabrewingMysteriousDuck.cost + 5,
//         Hand: [lenaSabrewingMysteriousDuck],
//         Play: [megaraSecretKeeper],
//         Deck: [basilTenaciousMouse, mickeyMouseDetective],
//       });
//
//       // Don't put any cards under Megara
//       Const megara = testEngine.getCardModel(megaraSecretKeeper);
//       Expect(megara.cardsUnder).toHaveLength(0);
//
//       Const initialLore = testEngine.getLoreForPlayer("player_one");
//
//       // Play Lena Sabrewing
//       Await testEngine.playCard(lenaSabrewingMysteriousDuck);
//
//       Const finalLore = testEngine.getLoreForPlayer("player_one");
//
//       Expect(finalLore).toBe(initialLore);
//     });
//
//     It("should work when there are multiple cards in the deck to boost", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: lenaSabrewingMysteriousDuck.cost + 5,
//         Hand: [lenaSabrewingMysteriousDuck],
//         Play: [megaraSecretKeeper],
//         Deck: [basilTenaciousMouse, mickeyMouseDetective, scarEerilyPrepared],
//       });
//
//       // Put a card under Megara (there are multiple cards in deck to choose from)
//       Await testEngine.activateCard(megaraSecretKeeper);
//
//       // Verify Megara has a card under her
//       Const megara = testEngine.getCardModel(megaraSecretKeeper);
//       Expect(megara.cardsUnder).toHaveLength(1);
//
//       Const initialLore = testEngine.getLoreForPlayer("player_one");
//
//       // Play Lena Sabrewing
//       Await testEngine.playCard(lenaSabrewingMysteriousDuck);
//
//       Const finalLore = testEngine.getLoreForPlayer("player_one");
//
//       Expect(finalLore).toBe(initialLore + 1);
//     });
//   });
// });
//
