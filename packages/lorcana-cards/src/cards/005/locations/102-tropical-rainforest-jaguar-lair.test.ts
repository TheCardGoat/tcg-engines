// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { tropicalRainforestJaguarLair } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Tropical Rainforest - Jaguar Lair", () => {
//   it.skip("**SNACK TIME** Opposing damaged characters gain **Reckless**. _(They can’t quest and must challenge if able.)_", () => {
//     const testStore = new TestStore({
//       inkwell: tropicalRainforestJaguarLair.cost,
//       play: [tropicalRainforestJaguarLair],
//     });
//
//     const cardUnderTest = testStore.getCard(tropicalRainforestJaguarLair);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
