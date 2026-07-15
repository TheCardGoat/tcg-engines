// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   EliLaBouffBigDaddy,
//   GoofyKnightForADay,
//   RatiganVeryLargeMouse,
//   RayEasygoingFirefly,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ratigan - Very Large Mouse", () => {
//   It("**THIS IS MY KINGDOM** When you play this character, exert chosen opposing character with 3 {S} or less. Chose one of your characters and ready them. They can't quest for the rest of this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: ratiganVeryLargeMouse.cost,
//         Hand: [ratiganVeryLargeMouse],
//         Play: [goofyKnightForADay],
//       },
//       { play: [rayEasygoingFirefly] },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       RatiganVeryLargeMouse.id,
//     );
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//     Const targetOpp = testStore.getByZoneAndId(
//       "play",
//       RayEasygoingFirefly.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({ targets: [targetOpp] }, true);
//     Expect(targetOpp.ready).toEqual(false);
//
//     TestStore.resolveTopOfStack({ targets: [target] }, true);
//     Expect(target.ready).toEqual(true);
//     Expect(target.hasQuestRestriction).toEqual(true);
//   });
// });
//
// Describe("Regression", () => {
//   It("should NOT block the game if there is not valid cards, on the opponent side", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: ratiganVeryLargeMouse.cost,
//       Hand: [ratiganVeryLargeMouse],
//     });
//
//     Await testEngine.playCard(ratiganVeryLargeMouse);
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
//
//   It("should NOT block the game if there is not valid cards on your side", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: ratiganVeryLargeMouse.cost,
//         Hand: [ratiganVeryLargeMouse],
//       },
//       {
//         Play: [eliLaBouffBigDaddy],
//       },
//     );
//
//     Await testEngine.playCard(
//       RatiganVeryLargeMouse,
//       {
//         Targets: [eliLaBouffBigDaddy],
//       },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(eliLaBouffBigDaddy).exerted).toEqual(true);
//     // expect(testEngine.stackLayers).toHaveLength(2);
//
//     // await testEngine.acceptOptionalLayer();
//     // expect(testEngine.stackLayers).toHaveLength(1);
//     // await testEngine.acceptOptionalLayer();
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
