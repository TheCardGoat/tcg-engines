// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { olympusWouldBeThatWay } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Olympus Would Be That Way", () => {
//   It("Your characters get +3 {S} this turn while challenging a location.", () => {
//     Const testStore = new TestStore({
//       Inkwell: olympusWouldBeThatWay.cost,
//       Hand: [olympusWouldBeThatWay],
//       Play: [mickeyBraveLittleTailor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       OlympusWouldBeThatWay.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({});
//
//     Expect(testStore.getZonesCardCount().discard).toBe(1); // Olympus Would Be That Way goes to discard
//   });
// });
//
