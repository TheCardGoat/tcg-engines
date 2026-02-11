// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { amethystChromicon } from "@lorcanito/lorcana-engine/cards/005/items/066-amethyst-chromicon";
// Import {
//   BalooLaidbackBear,
//   BasilTenaciousMouse,
//   DonaldGhostHunter,
//   MegaraSecretKeeper,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Megara - Secret Keeper", () => {
//   Describe("Boost 1", () => {
//     It("should have Boost 1 ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [megaraSecretKeeper],
//       });
//
//       Expect(testEngine.getCardModel(megaraSecretKeeper).hasBoost).toBe(true);
//     });
//   });
//
//   Describe("I'LL BE FINE - +1 Lore while card under character", () => {
//     It("should get +1 lore while there's a card under this character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Play: [megaraSecretKeeper],
//         Deck: [basilTenaciousMouse],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(megaraSecretKeeper);
//
//       // Before boost, should have base lore
//       Expect(cardUnderTest.lore).toBe(megaraSecretKeeper.lore);
//       Expect(cardUnderTest.cardsUnder).toHaveLength(0);
//
//       // Use boost to put a card under Megara
//       Await testEngine.activateCard(megaraSecretKeeper);
//
//       // Verify card was placed under Megara and lore increased
//       Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//       Expect(cardUnderTest.lore).toBe(megaraSecretKeeper.lore + 1);
//     });
//   });
//
//   Describe("I'LL BE FINE - Gained discard ability when challenged", () => {
//     It("should trigger discard ability when challenged if there's a card under this character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 5,
//           Play: [megaraSecretKeeper],
//           Deck: [basilTenaciousMouse],
//         },
//         {
//           Play: [donaldGhostHunter],
//           Hand: [mickeyMouseDetective, balooLaidbackBear],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(megaraSecretKeeper);
//       Const attacker = testEngine.getCardModel(donaldGhostHunter, 1);
//
//       // Use boost to put a card under Megara
//       Await testEngine.activateCard(megaraSecretKeeper);
//
//       // Verify card is under Megara
//       Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//
//       // Exert Megara to allow challenge
//       Await testEngine.exertCard(cardUnderTest);
//
//       // Opponent challenges Megara
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Verify opponent's hand count before discard
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(3); // mickeyMouseDetective + balooLaidbackBear + Drawn card
//
//       // Change back to player_one to resolve the triggered ability
//       // Resolve the triggered ability - opponent chooses and discards a card
//       Await testEngine.resolveTopOfStack({ targets: [mickeyMouseDetective] });
//
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
//     });
//   });
// });
//
