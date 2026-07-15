// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { tinkerBellTinyTactician } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tinker Bell - Tiny Tactician", () => {
//   It.skip("**Battle plans** {E} - Draw a card, then choose and discard a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: tinkerBellTinyTactician.cost,
//       Play: [tinkerBellTinyTactician],
//       Hand: [tinkerBellTinyTactician],
//     });
//
//     Await testEngine.playCard(tinkerBellTinyTactician);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
