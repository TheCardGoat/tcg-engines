// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { distract } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Distract", () => {
//   it("Chosen character gets -2 {S} this turn. Draw a card.", () => {
//     const testStore = new TestStore({
//       inkwell: distract.cost,
//       hand: [distract],
//       play: [cinderellaBallroomSensation],
//       deck: 2,
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", distract.id);
//     const target = testStore.getByZoneAndId(
//       "play",
//       cinderellaBallroomSensation.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.strength).toEqual(
//       Math.max(0, cinderellaBallroomSensation.strength - 2),
//     );
//     expect(testStore.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         hand: 1,
//         deck: 1,
//       }),
//     );
//   });
// });
//
