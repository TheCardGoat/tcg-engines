// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { robinHoodUnrivaledArcher } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Robin Hood - Unrivaled Archer", () => {
//   it.skip("**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: robinHoodUnrivaledArcher.cost,
//       hand: [robinHoodUnrivaledArcher],
//     });
//
//     await testEngine.playCard(robinHoodUnrivaledArcher);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
