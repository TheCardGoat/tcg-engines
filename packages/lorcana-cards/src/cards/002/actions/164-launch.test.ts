// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { launch } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Launch", () => {
//   It("Banish chosen item of yours to deal 5 damage to chosen character.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: launch.cost,
//         Hand: [launch],
//         Play: [pawpsicle],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", launch.id);
//     Const item = testStore.getByZoneAndId("play", pawpsicle.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       GoofyKnightForADay.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [item] }, true);
//     TestStore.resolveTopOfStack({
//       Targets: [target],
//     });
//
//     Expect(cardUnderTest.zone).toBe("discard");
//     Expect(item.zone).toBe("discard");
//     Expect(target.meta.damage).toBe(5);
//   });
// });
//
