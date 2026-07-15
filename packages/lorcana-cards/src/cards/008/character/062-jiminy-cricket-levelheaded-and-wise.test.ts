// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pinocchioOnTheRun } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { peterPanShadowFinder } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   JiminyCricketLevelheadedAndWise,
//   MonstroInfamousWhale,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jiminy Cricket - Level-Headed and Wise", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [jiminyCricketLevelheadedAndWise],
//     });
//
//     Expect(
//       TestEngine.getCardModel(jiminyCricketLevelheadedAndWise).hasEvasive,
//     ).toBe(true);
//   });
//
//   It("ENOUGH'S ENOUGH While this character is not exerted, opposing characters with Rush do not enter play exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: monstroInfamousWhale.cost,
//         Hand: [monstroInfamousWhale],
//       },
//       {
//         Play: [jiminyCricketLevelheadedAndWise],
//       },
//     );
//
//     Await testEngine.playCard(monstroInfamousWhale);
//
//     Expect(testEngine.getCardModel(monstroInfamousWhale).exerted).toBe(false);
//   });
//
//   It("ENOUGH'S ENOUGH While this character is exerted, opposing characters with Rush enter play exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: monstroInfamousWhale.cost,
//         Hand: [monstroInfamousWhale],
//       },
//       {
//         Play: [jiminyCricketLevelheadedAndWise],
//       },
//     );
//
//     Await testEngine.tapCard(jiminyCricketLevelheadedAndWise);
//     Await testEngine.playCard(monstroInfamousWhale);
//
//     Expect(testEngine.getCardModel(monstroInfamousWhale).exerted).toBe(true);
//   });
//
//   It("ENOUGH'S ENOUGH does not effect non-rush characters", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: monstroInfamousWhale.cost,
//         Hand: [pinocchioOnTheRun],
//       },
//       {
//         Play: [jiminyCricketLevelheadedAndWise],
//       },
//     );
//
//     Await testEngine.tapCard(jiminyCricketLevelheadedAndWise);
//     Await testEngine.playCard(pinocchioOnTheRun);
//
//     Expect(testEngine.getCardModel(pinocchioOnTheRun).exerted).toBe(false);
//   });
//
//   It("ENOUGH'S ENOUGH does not effect your own characters", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: monstroInfamousWhale.cost,
//       Hand: [peterPanShadowFinder],
//       Play: [jiminyCricketLevelheadedAndWise],
//     });
//
//     Await testEngine.tapCard(jiminyCricketLevelheadedAndWise);
//     Await testEngine.playCard(peterPanShadowFinder);
//
//     Expect(testEngine.getCardModel(peterPanShadowFinder).exerted).toBe(false);
//   });
// });
//
