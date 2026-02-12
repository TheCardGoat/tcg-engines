// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CheshireCatFromTheShadows,
//   GoofyKnightForADay,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cheshire Cat - From the Shadows", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Inkwell: cheshireCatFromTheShadows.cost,
//       Play: [cheshireCatFromTheShadows],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CheshireCatFromTheShadows.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toBeTruthy();
//   });
//
//   It("Evasive", () => {
//     Const testStore = new TestStore({
//       Inkwell: cheshireCatFromTheShadows.cost,
//       Play: [cheshireCatFromTheShadows],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CheshireCatFromTheShadows.id,
//     );
//
//     Expect(cardUnderTest.hasEvasive).toBeTruthy();
//   });
//
//   It("**WICKED SMILE** {E} − Banish chosen damaged character.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: cheshireCatFromTheShadows.cost,
//         Play: [cheshireCatFromTheShadows],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CheshireCatFromTheShadows.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       GoofyKnightForADay.id,
//       "player_two",
//     );
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
