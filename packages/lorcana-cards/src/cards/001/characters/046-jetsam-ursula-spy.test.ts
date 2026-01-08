// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   flotsamUrsulaSpy,
//   jetsamUrsulaSpy,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Jetsam - Ursula's Spy", () => {
//   it("Evasive", () => {
//     const testStore = new TestStore({
//       play: [jetsamUrsulaSpy],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", jetsamUrsulaSpy.id);
//
//     expect(cardUnderTest.hasEvasive).toEqual(true);
//   });
//
//   describe("**SINISTER SLITHER** Your characters named Flotsam gain **Evasive.**", () => {
//     it("Jetsam in play", () => {
//       const testStore = new TestStore({
//         play: [jetsamUrsulaSpy, flotsamUrsulaSpy],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         flotsamUrsulaSpy.id,
//       );
//
//       expect(cardUnderTest.hasEvasive).toEqual(true);
//     });
//
//     it("Jetsam NOT in play", () => {
//       const testStore = new TestStore({
//         play: [flotsamUrsulaSpy],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         flotsamUrsulaSpy.id,
//       );
//
//       expect(cardUnderTest.hasEvasive).toEqual(false);
//     });
//   });
// });
//
