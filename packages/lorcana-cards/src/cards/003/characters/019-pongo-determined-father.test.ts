// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PlutoFriendlyPooch,
//   PongoDeterminedFather,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pongo - Determined Father", () => {
//   It("**TWILIGHT BARK** Once per turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 3,
//       Play: [pongoDeterminedFather],
//       Deck: [plutoFriendlyPooch],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PongoDeterminedFather.id,
//     );
//     Const target = testStore.getCard(plutoFriendlyPooch);
//     CardUnderTest.activate("TWILIGHT BARK");
//     TestStore.resolveTopOfStack({ scry: { hand: [target], bottom: [] } });
//     Expect(testStore.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ deck: 0, hand: 1 }),
//     );
//     Expect(
//       TestStore.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toEqual(1);
//   });
// });
//
