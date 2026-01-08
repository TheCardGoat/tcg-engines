// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tritonChampionOfAtlantica } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Triton - Champion of Atlantica", () => {
//   it.skip("**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Triton.)_**IMPOSING PRESENCE** Opposing characters get -1 {S} for each location you have in play.", () => {
//     const testStore = new TestStore({
//       play: [tritonChampionOfAtlantica],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       tritonChampionOfAtlantica.id,
//     );
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
