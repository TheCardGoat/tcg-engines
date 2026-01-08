// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { gazelleAngelWithHorns } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Gazelle - Angel with Horns", () => {
//   it.skip("YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gazelleAngelWithHorns.cost,
//       hand: [gazelleAngelWithHorns],
//     });
//
//     await testEngine.playCard(gazelleAngelWithHorns);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
