// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyMouseFriendlyFace } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mickey Mouse - Friendly Face", () => {
//   it("**GLAD YOU’RE HERE!** Whenever this character quests, you pay 3 {I} less for the next character you play this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: mickeyMouseFriendlyFace.cost,
//       hand: [mickeyMouseFriendlyFace],
//       play: [mickeyMouseFriendlyFace],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       mickeyMouseFriendlyFace.id,
//     );
//
//     const target = testStore.getByZoneAndId("hand", mickeyMouseFriendlyFace.id);
//
//     const expectedInkAvailable = mickeyMouseFriendlyFace.cost - 3;
//
//     cardUnderTest.quest();
//
//     target.playFromHand();
//     expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(
//       expectedInkAvailable,
//     );
//   });
// });
//
