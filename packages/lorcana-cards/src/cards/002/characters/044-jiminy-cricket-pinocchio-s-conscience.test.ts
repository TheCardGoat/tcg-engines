// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JiminyCricketPinocchiosConscience,
//   PinocchioOnTheRun,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jiminy Cricket - Pinocchio's Conscience", () => {
//   Describe("**THAT STILL, SMALL VOICE** When you play this character, if you have a character named Pinocchio in play, you may draw a card.", () => {
//     It("should draw card if pinocchio is on play", () => {
//       Const testStore = new TestStore({
//         Inkwell: jiminyCricketPinocchiosConscience.cost,
//         Play: [pinocchioOnTheRun],
//         Hand: [jiminyCricketPinocchiosConscience],
//         Deck: [jiminyCricketPinocchiosConscience],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         JiminyCricketPinocchiosConscience.id,
//       );
//
//       Expect(
//         TestStore.getByZoneAndId("play", pinocchioOnTheRun.id),
//       ).toBeTruthy();
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({});
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 0,
//           Play: 2,
//         }),
//       );
//     });
//   });
// });
//
