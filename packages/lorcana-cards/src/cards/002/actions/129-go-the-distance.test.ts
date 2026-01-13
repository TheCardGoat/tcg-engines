// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goTheDistance } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Go the Distance", () => {
//   it("Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.", () => {
//     const testStore = new TestStore({
//       inkwell: goTheDistance.cost,
//       hand: [goTheDistance],
//       play: [goofyKnightForADay],
//       deck: 2,
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", goTheDistance.id);
//     const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     target.updateCardMeta({ damage: 1, exerted: true });
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.ready).toBe(true);
//     expect(target.hasQuestRestriction).toEqual(true);
//     expect(testStore.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         deck: 1,
//         hand: 1,
//       }),
//     );
//   });
// });
//
