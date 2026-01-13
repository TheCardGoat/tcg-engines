// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { scarHeartlessHunter } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Scar - Heartless Hunter", () => {
//   it.skip("BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: scarHeartlessHunter.cost,
//       hand: [scarHeartlessHunter],
//     });
//
//     await testEngine.playCard(scarHeartlessHunter);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
