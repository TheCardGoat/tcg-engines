// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   goGoTomagoMechanicalEngineer,
//   patchPlayfulPup,
//   sirPellinoreSeasonedKnight,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Sir Pellinore - Seasoned Knight", () => {
//   it("CODE OF HONOR Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: sirPellinoreSeasonedKnight.cost,
//       play: [
//         patchPlayfulPup,
//         sirPellinoreSeasonedKnight,
//         goGoTomagoMechanicalEngineer,
//       ],
//     });
//     expect(testEngine.getCardModel(patchPlayfulPup).hasSupport).toBe(false);
//     expect(
//       testEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
//     ).toBe(false);
//     await testEngine.questCard(sirPellinoreSeasonedKnight);
//     expect(testEngine.getCardModel(patchPlayfulPup).hasSupport).toBe(true);
//     expect(
//       testEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
//     ).toBe(true);
//     testEngine.passTurn();
//     expect(testEngine.getCardModel(patchPlayfulPup).hasSupport).toBe(false);
//     expect(
//       testEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
//     ).toBe(false);
//   });
// });
//
