// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// import { magicaDeSpellShadowyAndSinister } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Magica De Spell - Shadowy and Sinister", () => {
//   it("DARK INCANTATION - Should shuffle a card from your own discard into your deck", async () => {
//     const testEngine = new TestEngine({
//       inkwell: magicaDeSpellShadowyAndSinister.cost,
//       hand: [magicaDeSpellShadowyAndSinister],
//       discard: [deweyLovableShowoff],
//       deck: 10,
//     });
//
//     const cardInDiscard = testEngine.getCardModel(deweyLovableShowoff);
//
//     expect(cardInDiscard.zone).toBe("discard");
//     expect(testEngine.getZonesCardCount("player_one").deck).toBe(10);
//
//     await testEngine.playCard(magicaDeSpellShadowyAndSinister);
//     await testEngine.acceptOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [cardInDiscard] });
//
//     expect(cardInDiscard.zone).toBe("deck");
//     expect(testEngine.getZonesCardCount("player_one").deck).toBe(11);
//   });
//
//   it("DARK INCANTATION - Should shuffle a card from opponent's discard into their deck", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: magicaDeSpellShadowyAndSinister.cost,
//         hand: [magicaDeSpellShadowyAndSinister],
//         deck: 10,
//       },
//       {
//         discard: [deweyLovableShowoff],
//         deck: 10,
//       },
//     );
//
//     const opponentCardInDiscard = testEngine.getCardModel(deweyLovableShowoff);
//
//     expect(opponentCardInDiscard.zone).toBe("discard");
//     expect(testEngine.getZonesCardCount("player_two").deck).toBe(10);
//
//     await testEngine.playCard(magicaDeSpellShadowyAndSinister);
//     await testEngine.acceptOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [opponentCardInDiscard] });
//
//     expect(opponentCardInDiscard.zone).toBe("deck");
//     expect(testEngine.getZonesCardCount("player_two").deck).toBe(11);
//   });
//
//   it("DARK INCANTATION - Should be optional", async () => {
//     const testEngine = new TestEngine({
//       inkwell: magicaDeSpellShadowyAndSinister.cost,
//       hand: [magicaDeSpellShadowyAndSinister],
//       discard: [deweyLovableShowoff],
//       deck: 10,
//     });
//
//     const cardInDiscard = testEngine.getCardModel(deweyLovableShowoff);
//
//     expect(cardInDiscard.zone).toBe("discard");
//
//     await testEngine.playCard(magicaDeSpellShadowyAndSinister);
//     await testEngine.skipTopOfStack();
//
//     expect(cardInDiscard.zone).toBe("discard");
//     expect(testEngine.getZonesCardCount("player_one").deck).toBe(10);
//   });
// });
//
