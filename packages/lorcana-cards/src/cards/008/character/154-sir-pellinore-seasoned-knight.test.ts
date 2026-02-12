// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoGoTomagoMechanicalEngineer,
//   PatchPlayfulPup,
//   SirPellinoreSeasonedKnight,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Sir Pellinore - Seasoned Knight", () => {
//   It("CODE OF HONOR Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: sirPellinoreSeasonedKnight.cost,
//       Play: [
//         PatchPlayfulPup,
//         SirPellinoreSeasonedKnight,
//         GoGoTomagoMechanicalEngineer,
//       ],
//     });
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasSupport).toBe(false);
//     Expect(
//       TestEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
//     ).toBe(false);
//     Await testEngine.questCard(sirPellinoreSeasonedKnight);
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasSupport).toBe(true);
//     Expect(
//       TestEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
//     ).toBe(true);
//     TestEngine.passTurn();
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasSupport).toBe(false);
//     Expect(
//       TestEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
//     ).toBe(false);
//   });
// });
//
