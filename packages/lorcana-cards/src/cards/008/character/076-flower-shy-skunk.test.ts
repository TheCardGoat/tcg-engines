// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { madamMimFox } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   DeweyLovableShowoff,
//   FlowerShySkunk,
//   LouieOneCoolDuck,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Flower - Shy Skunk", () => {
//   It("LOOKING FOR FRIENDS Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: deweyLovableShowoff.cost,
//       Play: [flowerShySkunk],
//       Hand: [deweyLovableShowoff],
//       Deck: [louieOneCoolDuck, madamMimFox],
//     });
//
//     Const newCardInPlay = testEngine.getCardModel(deweyLovableShowoff);
//     Const first = testEngine.getCardModel(madamMimFox);
//     Const last = testEngine.getCardModel(louieOneCoolDuck);
//     Expect(testEngine.store.tableStore.getTable().zones.deck.cards).toEqual([
//       Last,
//       First,
//     ]);
//
//     Await testEngine.playCard(newCardInPlay);
//     TestEngine.resolveOptionalAbility(true);
//
//     Await testEngine.resolveTopOfStack({ scry: { top: [last] } });
//
//     Expect(testEngine.store.tableStore.getTable().zones.deck.cards).toEqual([
//       First,
//       Last,
//     ]);
//   });
// });
//
