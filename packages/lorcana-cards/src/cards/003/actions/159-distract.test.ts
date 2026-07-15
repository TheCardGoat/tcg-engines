// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { distract } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Distract", () => {
//   It("Chosen character gets -2 {S} this turn. Draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: distract.cost,
//       Hand: [distract],
//       Play: [cinderellaBallroomSensation],
//       Deck: 2,
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", distract.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       CinderellaBallroomSensation.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toEqual(
//       Math.max(0, cinderellaBallroomSensation.strength - 2),
//     );
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 1,
//       }),
//     );
//   });
// });
//
