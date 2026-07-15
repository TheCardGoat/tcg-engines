// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { breakFree } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Break Free", () => {
//   It("Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they're played.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: breakFree.cost,
//       Hand: [breakFree],
//       Play: [mickeyBraveLittleTailor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", breakFree.id);
//     Const targetCharacter = testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//     );
//
//     Expect(targetCharacter.damage).toBe(0);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Test that 1 damage was dealt
//     Expect(targetCharacter.damage).toBe(1);
//     Expect(testStore.getZonesCardCount().discard).toBe(1); // Break Free goes to discard
//   });
// });
//
