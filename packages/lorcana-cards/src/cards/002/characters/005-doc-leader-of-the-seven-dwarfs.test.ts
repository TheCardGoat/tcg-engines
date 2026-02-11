// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DocLeaderOfTheSevenDwarfs,
//   EudoraAccomplishedSeamstress,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Doc - Leader of the Seven Dwarfs", () => {
//   It("**SHARE AND SHARE ALIKE** Whenever this character quests, you pay 1 {I} less for the next character you play this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: eudoraAccomplishedSeamstress.cost - 1,
//       Hand: [eudoraAccomplishedSeamstress],
//       Play: [docLeaderOfTheSevenDwarfs],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DocLeaderOfTheSevenDwarfs.id,
//     );
//     Const reducedCostChar = testStore.getByZoneAndId(
//       "hand",
//       EudoraAccomplishedSeamstress.id,
//     );
//
//     CardUnderTest.quest();
//     ReducedCostChar.playFromHand();
//
//     Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//     Expect(reducedCostChar.zone).toEqual("play");
//   });
// });
//
