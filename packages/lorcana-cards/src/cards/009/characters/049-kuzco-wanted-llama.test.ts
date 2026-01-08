// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { kuzcoWantedLlama } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Kuzco - Wanted Llama", () => {
//   it.skip("**OK, WHERE AM I?** When this character is banished, you may draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: kuzcoWantedLlama.cost,
//       play: [kuzcoWantedLlama],
//       hand: [kuzcoWantedLlama],
//     });
//
//     await testEngine.playCard(kuzcoWantedLlama);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
