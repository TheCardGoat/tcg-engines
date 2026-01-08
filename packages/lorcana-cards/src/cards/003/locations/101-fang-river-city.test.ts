// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { fangRiverCity } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Fang - River City", () => {
//   describe("**SURROUNDED BY WATER** Characters gain **Ward** and **Evasive** while here. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_", () => {
//     it("Characters gain **Ward** and **Evasive** while here.", () => {
//       const testStore = new TestStore({
//         inkwell: fangRiverCity.moveCost,
//         play: [fangRiverCity, goofyKnightForADay],
//       });
//
//       const cardUnderTest = testStore.getCard(fangRiverCity);
//       const targetCard = testStore.getCard(goofyKnightForADay);
//
//       expect(targetCard.hasWard).toBe(false);
//
//       targetCard.enterLocation(cardUnderTest);
//
//       expect(targetCard.hasWard).toBe(true);
//     });
//
//     it("Characters gain **Evasive** while here.", () => {
//       const testStore = new TestStore({
//         inkwell: fangRiverCity.moveCost,
//         play: [fangRiverCity, goofyKnightForADay],
//       });
//
//       const cardUnderTest = testStore.getCard(fangRiverCity);
//       const targetCard = testStore.getCard(goofyKnightForADay);
//
//       expect(targetCard.hasEvasive).toBe(false);
//
//       targetCard.enterLocation(cardUnderTest);
//
//       expect(targetCard.hasEvasive).toBe(true);
//     });
//   });
// });
//
