// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { bosssOrders } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Boss's Orders", () => {
//   It("Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: bosssOrders.cost,
//       Hand: [bosssOrders],
//       Play: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", bosssOrders.id);
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasSupport).toBe(true);
//
//     TestStore.passTurn();
//
//     Expect(target.hasSupport).toBe(false);
//   });
// });
//
