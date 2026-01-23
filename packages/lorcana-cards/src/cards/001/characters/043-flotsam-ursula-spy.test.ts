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
// describe("Floatsam - Ursula's Spy", () => {
//   it("Rush", () => {
//     const testStore = new TestStore({
//       play: [flotsamUrsulaSpy],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", flotsamUrsulaSpy.id);
//
//     expect(cardUnderTest.hasRush).toEqual(true);
//   });
//
//   describe("**DEXTEROUS LUNGE** Your characters named Jetsam gain **Rush.**", () => {
//     it("Flotsam in play", () => {
//       const testStore = new TestStore({
//         play: [jetsamUrsulaSpy, flotsamUrsulaSpy],
//       });
//
//       const cardUnderTest = testStore.getCard(jetsamUrsulaSpy);
//
//       expect(cardUnderTest.hasRush).toEqual(true);
//     });
//
//     it("Flotsam NOT in play", () => {
//       const testStore = new TestStore({
//         play: [jetsamUrsulaSpy],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         jetsamUrsulaSpy.id,
//       );
//
//       expect(cardUnderTest.hasRush).toEqual(false);
//     });
//   });
// });
//
