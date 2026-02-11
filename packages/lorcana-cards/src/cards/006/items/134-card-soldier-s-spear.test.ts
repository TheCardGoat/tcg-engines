// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { cardSoldiersSpear } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Card Soldier's Spear", () => {
//   It.skip("A SUITABLE WEAPON Your damaged characters get +1 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: cardSoldiersSpear.cost,
//       Play: [cardSoldiersSpear],
//       Hand: [cardSoldiersSpear],
//     });
//
//     Await testEngine.playCard(cardSoldiersSpear);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
