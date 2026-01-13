// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { duckForCover } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Duck for Cover!", () => {
//   it("Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_", () => {
//     const testStore = new TestStore({
//       inkwell: duckForCover.cost,
//       hand: [duckForCover],
//       play: [mickeyBraveLittleTailor],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", duckForCover.id);
//     const targetCharacter = testStore.getByZoneAndId(
//       "play",
//       mickeyBraveLittleTailor.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//     expect(testStore.getZonesCardCount().discard).toBe(1); // Duck for Cover! goes to discard
//   });
// });
//
