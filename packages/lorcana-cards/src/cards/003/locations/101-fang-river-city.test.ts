// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { fangRiverCity } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fang - River City", () => {
//   Describe("**SURROUNDED BY WATER** Characters gain **Ward** and **Evasive** while here. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_", () => {
//     It("Characters gain **Ward** and **Evasive** while here.", () => {
//       Const testStore = new TestStore({
//         Inkwell: fangRiverCity.moveCost,
//         Play: [fangRiverCity, goofyKnightForADay],
//       });
//
//       Const cardUnderTest = testStore.getCard(fangRiverCity);
//       Const targetCard = testStore.getCard(goofyKnightForADay);
//
//       Expect(targetCard.hasWard).toBe(false);
//
//       TargetCard.enterLocation(cardUnderTest);
//
//       Expect(targetCard.hasWard).toBe(true);
//     });
//
//     It("Characters gain **Evasive** while here.", () => {
//       Const testStore = new TestStore({
//         Inkwell: fangRiverCity.moveCost,
//         Play: [fangRiverCity, goofyKnightForADay],
//       });
//
//       Const cardUnderTest = testStore.getCard(fangRiverCity);
//       Const targetCard = testStore.getCard(goofyKnightForADay);
//
//       Expect(targetCard.hasEvasive).toBe(false);
//
//       TargetCard.enterLocation(cardUnderTest);
//
//       Expect(targetCard.hasEvasive).toBe(true);
//     });
//   });
// });
//
