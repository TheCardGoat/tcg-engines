// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { tropicalRainforestJaguarLair } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tropical Rainforest - Jaguar Lair", () => {
//   It.skip("**SNACK TIME** Opposing damaged characters gain **Reckless**. _(They can’t quest and must challenge if able.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: tropicalRainforestJaguarLair.cost,
//       Play: [tropicalRainforestJaguarLair],
//     });
//
//     Const cardUnderTest = testStore.getCard(tropicalRainforestJaguarLair);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
