// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { magicaDeSpellShadowyAndSinister } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Magica De Spell - Shadowy and Sinister", () => {
//   It("DARK INCANTATION - Should shuffle a card from your own discard into your deck", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: magicaDeSpellShadowyAndSinister.cost,
//       Hand: [magicaDeSpellShadowyAndSinister],
//       Discard: [deweyLovableShowoff],
//       Deck: 10,
//     });
//
//     Const cardInDiscard = testEngine.getCardModel(deweyLovableShowoff);
//
//     Expect(cardInDiscard.zone).toBe("discard");
//     Expect(testEngine.getZonesCardCount("player_one").deck).toBe(10);
//
//     Await testEngine.playCard(magicaDeSpellShadowyAndSinister);
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [cardInDiscard] });
//
//     Expect(cardInDiscard.zone).toBe("deck");
//     Expect(testEngine.getZonesCardCount("player_one").deck).toBe(11);
//   });
//
//   It("DARK INCANTATION - Should shuffle a card from opponent's discard into their deck", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: magicaDeSpellShadowyAndSinister.cost,
//         Hand: [magicaDeSpellShadowyAndSinister],
//         Deck: 10,
//       },
//       {
//         Discard: [deweyLovableShowoff],
//         Deck: 10,
//       },
//     );
//
//     Const opponentCardInDiscard = testEngine.getCardModel(deweyLovableShowoff);
//
//     Expect(opponentCardInDiscard.zone).toBe("discard");
//     Expect(testEngine.getZonesCardCount("player_two").deck).toBe(10);
//
//     Await testEngine.playCard(magicaDeSpellShadowyAndSinister);
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [opponentCardInDiscard] });
//
//     Expect(opponentCardInDiscard.zone).toBe("deck");
//     Expect(testEngine.getZonesCardCount("player_two").deck).toBe(11);
//   });
//
//   It("DARK INCANTATION - Should be optional", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: magicaDeSpellShadowyAndSinister.cost,
//       Hand: [magicaDeSpellShadowyAndSinister],
//       Discard: [deweyLovableShowoff],
//       Deck: 10,
//     });
//
//     Const cardInDiscard = testEngine.getCardModel(deweyLovableShowoff);
//
//     Expect(cardInDiscard.zone).toBe("discard");
//
//     Await testEngine.playCard(magicaDeSpellShadowyAndSinister);
//     Await testEngine.skipTopOfStack();
//
//     Expect(cardInDiscard.zone).toBe("discard");
//     Expect(testEngine.getZonesCardCount("player_one").deck).toBe(10);
//   });
// });
//
