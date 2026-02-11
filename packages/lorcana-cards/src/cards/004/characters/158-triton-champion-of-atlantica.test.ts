// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tritonChampionOfAtlantica } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Triton - Champion of Atlantica", () => {
//   It.skip("**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Triton.)_**IMPOSING PRESENCE** Opposing characters get -1 {S} for each location you have in play.", () => {
//     Const testStore = new TestStore({
//       Play: [tritonChampionOfAtlantica],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TritonChampionOfAtlantica.id,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
