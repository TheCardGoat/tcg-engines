// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goTheDistance } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Go the Distance", () => {
//   It("Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: goTheDistance.cost,
//       Hand: [goTheDistance],
//       Play: [goofyKnightForADay],
//       Deck: 2,
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", goTheDistance.id);
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     Target.updateCardMeta({ damage: 1, exerted: true });
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.ready).toBe(true);
//     Expect(target.hasQuestRestriction).toEqual(true);
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 1,
//         Hand: 1,
//       }),
//     );
//   });
// });
//
