// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   docLeaderOfTheSevenDwarfs,
//   eudoraAccomplishedSeamstress,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Doc - Leader of the Seven Dwarfs", () => {
//   it("**SHARE AND SHARE ALIKE** Whenever this character quests, you pay 1 {I} less for the next character you play this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: eudoraAccomplishedSeamstress.cost - 1,
//       hand: [eudoraAccomplishedSeamstress],
//       play: [docLeaderOfTheSevenDwarfs],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       docLeaderOfTheSevenDwarfs.id,
//     );
//     const reducedCostChar = testStore.getByZoneAndId(
//       "hand",
//       eudoraAccomplishedSeamstress.id,
//     );
//
//     cardUnderTest.quest();
//     reducedCostChar.playFromHand();
//
//     expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//     expect(reducedCostChar.zone).toEqual("play");
//   });
// });
//
