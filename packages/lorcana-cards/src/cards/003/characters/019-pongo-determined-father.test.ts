// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   plutoFriendlyPooch,
//   pongoDeterminedFather,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Pongo - Determined Father", () => {
//   it("**TWILIGHT BARK** Once per turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.", () => {
//     const testStore = new TestStore({
//       inkwell: 3,
//       play: [pongoDeterminedFather],
//       deck: [plutoFriendlyPooch],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       pongoDeterminedFather.id,
//     );
//     const target = testStore.getCard(plutoFriendlyPooch);
//     cardUnderTest.activate("TWILIGHT BARK");
//     testStore.resolveTopOfStack({ scry: { hand: [target], bottom: [] } });
//     expect(testStore.getZonesCardCount("player_one")).toEqual(
//       expect.objectContaining({ deck: 0, hand: 1 }),
//     );
//     expect(
//       testStore.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toEqual(1);
//   });
// });
//
