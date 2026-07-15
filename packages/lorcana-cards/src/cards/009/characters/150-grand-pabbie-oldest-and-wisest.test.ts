// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { grandPabbieOldestAndWisest } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Grand Pabbie - Oldest and Wisest", () => {
//   It.skip("**ANCIENT INSIGHT** Whenever you remove 1 or more damage from one of your characters, gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: grandPabbieOldestAndWisest.cost,
//       Play: [grandPabbieOldestAndWisest],
//       Hand: [grandPabbieOldestAndWisest],
//     });
//
//     Await testEngine.playCard(grandPabbieOldestAndWisest);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
