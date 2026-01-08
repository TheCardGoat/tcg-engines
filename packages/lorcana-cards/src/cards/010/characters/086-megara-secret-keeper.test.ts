// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { amethystChromicon } from "@lorcanito/lorcana-engine/cards/005/items/066-amethyst-chromicon";
// import {
//   balooLaidbackBear,
//   basilTenaciousMouse,
//   donaldGhostHunter,
//   megaraSecretKeeper,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Megara - Secret Keeper", () => {
//   describe("Boost 1", () => {
//     it("should have Boost 1 ability", () => {
//       const testEngine = new TestEngine({
//         play: [megaraSecretKeeper],
//       });
//
//       expect(testEngine.getCardModel(megaraSecretKeeper).hasBoost).toBe(true);
//     });
//   });
//
//   describe("I'LL BE FINE - +1 Lore while card under character", () => {
//     it("should get +1 lore while there's a card under this character", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         play: [megaraSecretKeeper],
//         deck: [basilTenaciousMouse],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(megaraSecretKeeper);
//
//       // Before boost, should have base lore
//       expect(cardUnderTest.lore).toBe(megaraSecretKeeper.lore);
//       expect(cardUnderTest.cardsUnder).toHaveLength(0);
//
//       // Use boost to put a card under Megara
//       await testEngine.activateCard(megaraSecretKeeper);
//
//       // Verify card was placed under Megara and lore increased
//       expect(cardUnderTest.cardsUnder).toHaveLength(1);
//       expect(cardUnderTest.lore).toBe(megaraSecretKeeper.lore + 1);
//     });
//   });
//
//   describe("I'LL BE FINE - Gained discard ability when challenged", () => {
//     it("should trigger discard ability when challenged if there's a card under this character", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 5,
//           play: [megaraSecretKeeper],
//           deck: [basilTenaciousMouse],
//         },
//         {
//           play: [donaldGhostHunter],
//           hand: [mickeyMouseDetective, balooLaidbackBear],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(megaraSecretKeeper);
//       const attacker = testEngine.getCardModel(donaldGhostHunter, 1);
//
//       // Use boost to put a card under Megara
//       await testEngine.activateCard(megaraSecretKeeper);
//
//       // Verify card is under Megara
//       expect(cardUnderTest.cardsUnder).toHaveLength(1);
//
//       // Exert Megara to allow challenge
//       await testEngine.exertCard(cardUnderTest);
//
//       // Opponent challenges Megara
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Verify opponent's hand count before discard
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(3); // mickeyMouseDetective + balooLaidbackBear + Drawn card
//
//       // Change back to player_one to resolve the triggered ability
//       // Resolve the triggered ability - opponent chooses and discards a card
//       await testEngine.resolveTopOfStack({ targets: [mickeyMouseDetective] });
//
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
//     });
//   });
// });
//
