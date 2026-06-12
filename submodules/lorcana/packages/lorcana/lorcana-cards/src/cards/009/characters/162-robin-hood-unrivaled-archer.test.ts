// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { robinHoodUnrivaledArcher } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Robin Hood - Unrivaled Archer", () => {
//   It.skip("**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: robinHoodUnrivaledArcher.cost,
//       Hand: [robinHoodUnrivaledArcher],
//     });
//
//     Await testEngine.playCard(robinHoodUnrivaledArcher);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
