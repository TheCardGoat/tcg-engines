// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { stichtCarefreeSurfer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { vanellopeVonSchweetzSugarRushChamp } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   RapunzelsTowerSecludedPrison,
//   SugarRushSpeedwayStartingLine,
// } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { sugarRushSpeedwayFinishLine } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sugar Rush Speedway - Starting Line", () => {
//   It("**ON YOUR MARKS!** Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.", () => {
//     Const testStore = new TestStore({
//       Inkwell: sugarRushSpeedwayStartingLine.moveCost,
//       Play: [
//         SugarRushSpeedwayStartingLine,
//         StichtCarefreeSurfer,
//         RapunzelsTowerSecludedPrison,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getCard(sugarRushSpeedwayStartingLine);
//     Const characterUnderTest = testStore.getCard(stichtCarefreeSurfer);
//     Const anotherLocation = testStore.getCard(rapunzelsTowerSecludedPrison);
//
//     CharacterUnderTest.updateCardMeta({ exerted: false, damage: 0 });
//
//     CharacterUnderTest.enterLocation(cardUnderTest);
//
//     Expect(characterUnderTest.meta.exerted).toBe(false);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [characterUnderTest] }, true);
//     TestStore.resolveTopOfStack({ targets: [anotherLocation] });
//
//     Expect(characterUnderTest.meta.damage).toBe(1);
//     Expect(characterUnderTest.meta.exerted).toBe(true);
//     Expect(characterUnderTest.isAtLocation(anotherLocation)).toBe(true);
//   });
//
//   Describe("Regression test", () => {
//     It("Character dying while moving from starting line", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell:
//           SugarRushSpeedwayFinishLine.moveCost +
//           SugarRushSpeedwayStartingLine.moveCost,
//         Play: [
//           SugarRushSpeedwayFinishLine,
//           SugarRushSpeedwayStartingLine,
//           VanellopeVonSchweetzSugarRushChamp,
//         ],
//         Deck: 5,
//       });
//
//       Await testEngine.moveToLocation({
//         Location: sugarRushSpeedwayStartingLine,
//         Character: vanellopeVonSchweetzSugarRushChamp,
//       });
//
//       Await testEngine.setCardDamage(
//         VanellopeVonSchweetzSugarRushChamp,
//         VanellopeVonSchweetzSugarRushChamp.willpower - 1,
//       );
//
//       Await testEngine.activateCard(
//         SugarRushSpeedwayStartingLine,
//         {
//           Targets: [vanellopeVonSchweetzSugarRushChamp],
//         },
//         True,
//       );
//
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [sugarRushSpeedwayFinishLine],
//         },
//         True,
//       );
//
//       // Resolve Finish Line ability
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(testEngine.getPlayerLore()).toEqual(3);
//       Expect(testEngine.getZonesCardCount().hand).toEqual(3);
//       Expect(testEngine.getCardModel(sugarRushSpeedwayFinishLine).zone).toBe(
//         "discard",
//       );
//
//       Expect(
//         TestEngine.getCardModel(vanellopeVonSchweetzSugarRushChamp).zone,
//       ).toBe("discard");
//     });
//   });
// });
//
