// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { kuzcoWantedLlama } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kuzco - Wanted Llama", () => {
//   It.skip("**OK, WHERE AM I?** When this character is banished, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: kuzcoWantedLlama.cost,
//       Play: [kuzcoWantedLlama],
//       Hand: [kuzcoWantedLlama],
//     });
//
//     Await testEngine.playCard(kuzcoWantedLlama);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
