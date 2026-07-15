// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { brunosReturn } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bruno's Return", () => {
//   It.skip("Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: brunosReturn.cost,
//       Play: [brunosReturn],
//       Hand: [brunosReturn],
//     });
//
//     Await testEngine.playCard(brunosReturn);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
