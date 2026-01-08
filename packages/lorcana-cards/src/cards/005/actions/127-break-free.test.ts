// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { breakFree } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Break Free", () => {
//   it("Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they're played.)_", () => {
//     const testStore = new TestStore({
//       inkwell: breakFree.cost,
//       hand: [breakFree],
//       play: [mickeyBraveLittleTailor],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", breakFree.id);
//     const targetCharacter = testStore.getByZoneAndId(
//       "play",
//       mickeyBraveLittleTailor.id,
//     );
//
//     expect(targetCharacter.damage).toBe(0);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Test that 1 damage was dealt
//     expect(targetCharacter.damage).toBe(1);
//     expect(testStore.getZonesCardCount().discard).toBe(1); // Break Free goes to discard
//   });
// });
//
