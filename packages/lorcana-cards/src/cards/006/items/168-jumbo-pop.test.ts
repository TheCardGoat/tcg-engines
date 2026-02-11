// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jumboPop } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jumbo Pop", () => {
//   It.skip("HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jumboPop.cost,
//       Play: [jumboPop],
//       Hand: [jumboPop],
//     });
//
//     Await testEngine.playCard(jumboPop);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
