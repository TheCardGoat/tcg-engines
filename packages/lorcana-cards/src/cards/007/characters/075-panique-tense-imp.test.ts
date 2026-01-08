// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { paniqueTenseImp } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Panique - Tense Imp", () => {
//   it.skip("FRIGHTENED SCREAM When you play this character, you can choose a character and move up to 2 of its damage to an opposing character of your choice.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: paniqueTenseImp.cost,
//       hand: [paniqueTenseImp],
//     });
//
//     await testEngine.playCard(paniqueTenseImp);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
