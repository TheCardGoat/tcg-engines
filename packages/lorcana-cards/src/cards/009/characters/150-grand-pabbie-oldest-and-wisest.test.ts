// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { grandPabbieOldestAndWisest } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Grand Pabbie - Oldest and Wisest", () => {
//   it.skip("**ANCIENT INSIGHT** Whenever you remove 1 or more damage from one of your characters, gain 2 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: grandPabbieOldestAndWisest.cost,
//       play: [grandPabbieOldestAndWisest],
//       hand: [grandPabbieOldestAndWisest],
//     });
//
//     await testEngine.playCard(grandPabbieOldestAndWisest);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
