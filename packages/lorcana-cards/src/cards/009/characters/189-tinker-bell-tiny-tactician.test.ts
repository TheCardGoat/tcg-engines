// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { tinkerBellTinyTactician } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Tinker Bell - Tiny Tactician", () => {
//   it.skip("**Battle plans** {E} - Draw a card, then choose and discard a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: tinkerBellTinyTactician.cost,
//       play: [tinkerBellTinyTactician],
//       hand: [tinkerBellTinyTactician],
//     });
//
//     await testEngine.playCard(tinkerBellTinyTactician);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
