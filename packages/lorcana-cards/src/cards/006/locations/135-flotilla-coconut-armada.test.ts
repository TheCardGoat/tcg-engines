// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { flotillaCoconutArmada } from "@lorcanito/lorcana-engine/cards/006/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Flotilla - Coconut Armada", () => {
//   It.skip("TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: flotillaCoconutArmada.cost,
//       Play: [flotillaCoconutArmada],
//       Hand: [flotillaCoconutArmada],
//     });
//
//     Await testEngine.playCard(flotillaCoconutArmada);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
