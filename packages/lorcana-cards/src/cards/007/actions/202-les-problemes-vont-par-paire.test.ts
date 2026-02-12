// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AladdinHeroicOutlaw,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { doubleTrouble } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Les Problemes Vont Par Paire", () => {
//   It("Deal 1 damage to up to 2 chosen characters", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: doubleTrouble.cost,
//         Hand: [doubleTrouble],
//       },
//       {
//         Play: [aladdinHeroicOutlaw, moanaOfMotunui],
//       },
//     );
//
//     Await testEngine.playCard(doubleTrouble, {
//       Targets: [
//         TestEngine.getCardModel(aladdinHeroicOutlaw),
//         TestEngine.getCardModel(moanaOfMotunui),
//       ],
//     });
//
//     Expect(testEngine.getCardModel(aladdinHeroicOutlaw).damage).toBe(1);
//     Expect(testEngine.getCardModel(moanaOfMotunui).damage).toBe(1);
//   });
// });
//
