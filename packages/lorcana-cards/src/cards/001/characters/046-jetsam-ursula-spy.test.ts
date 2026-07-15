// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FlotsamUrsulaSpy,
//   JetsamUrsulaSpy,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jetsam - Ursula's Spy", () => {
//   It("Evasive", () => {
//     Const testStore = new TestStore({
//       Play: [jetsamUrsulaSpy],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", jetsamUrsulaSpy.id);
//
//     Expect(cardUnderTest.hasEvasive).toEqual(true);
//   });
//
//   Describe("**SINISTER SLITHER** Your characters named Flotsam gain **Evasive.**", () => {
//     It("Jetsam in play", () => {
//       Const testStore = new TestStore({
//         Play: [jetsamUrsulaSpy, flotsamUrsulaSpy],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         FlotsamUrsulaSpy.id,
//       );
//
//       Expect(cardUnderTest.hasEvasive).toEqual(true);
//     });
//
//     It("Jetsam NOT in play", () => {
//       Const testStore = new TestStore({
//         Play: [flotsamUrsulaSpy],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         FlotsamUrsulaSpy.id,
//       );
//
//       Expect(cardUnderTest.hasEvasive).toEqual(false);
//     });
//   });
// });
//
