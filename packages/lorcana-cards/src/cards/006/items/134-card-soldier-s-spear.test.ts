// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { cardSoldiersSpear } from "@lorcanito/lorcana-engine/cards/006/items/items";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Card Soldier's Spear", () => {
//   it.skip("A SUITABLE WEAPON Your damaged characters get +1 {S}.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: cardSoldiersSpear.cost,
//       play: [cardSoldiersSpear],
//       hand: [cardSoldiersSpear],
//     });
//
//     await testEngine.playCard(cardSoldiersSpear);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
