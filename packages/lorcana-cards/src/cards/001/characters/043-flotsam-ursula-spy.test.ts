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
// Describe("Floatsam - Ursula's Spy", () => {
//   It("Rush", () => {
//     Const testStore = new TestStore({
//       Play: [flotsamUrsulaSpy],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", flotsamUrsulaSpy.id);
//
//     Expect(cardUnderTest.hasRush).toEqual(true);
//   });
//
//   Describe("**DEXTEROUS LUNGE** Your characters named Jetsam gain **Rush.**", () => {
//     It("Flotsam in play", () => {
//       Const testStore = new TestStore({
//         Play: [jetsamUrsulaSpy, flotsamUrsulaSpy],
//       });
//
//       Const cardUnderTest = testStore.getCard(jetsamUrsulaSpy);
//
//       Expect(cardUnderTest.hasRush).toEqual(true);
//     });
//
//     It("Flotsam NOT in play", () => {
//       Const testStore = new TestStore({
//         Play: [jetsamUrsulaSpy],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         JetsamUrsulaSpy.id,
//       );
//
//       Expect(cardUnderTest.hasRush).toEqual(false);
//     });
//   });
// });
//
