// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseFriendlyFace } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mickey Mouse - Friendly Face", () => {
//   It("**GLAD YOU’RE HERE!** Whenever this character quests, you pay 3 {I} less for the next character you play this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mickeyMouseFriendlyFace.cost,
//       Hand: [mickeyMouseFriendlyFace],
//       Play: [mickeyMouseFriendlyFace],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MickeyMouseFriendlyFace.id,
//     );
//
//     Const target = testStore.getByZoneAndId("hand", mickeyMouseFriendlyFace.id);
//
//     Const expectedInkAvailable = mickeyMouseFriendlyFace.cost - 3;
//
//     CardUnderTest.quest();
//
//     Target.playFromHand();
//     Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(
//       ExpectedInkAvailable,
//     );
//   });
// });
//
