// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { improvise } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Improvise", () => {
//   It("Chosen character gets +1 {S} this turn. Draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: improvise.cost,
//       Hand: [improvise],
//       Play: [cinderellaBallroomSensation],
//       Deck: 2,
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", improvise.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       CinderellaBallroomSensation.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toEqual(cinderellaBallroomSensation.strength + 1);
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 1,
//       }),
//     );
//   });
// });
//
