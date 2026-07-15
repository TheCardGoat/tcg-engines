// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { pepaMadrigalWeatherMaker } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pepa Madrigal - Weather Maker", () => {
//   It.skip("**IT LOOKS LIKE RAIN** When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless you're at a location.", () => {
//     Const testStore = new TestStore({
//       Inkwell: pepaMadrigalWeatherMaker.cost,
//       Hand: [pepaMadrigalWeatherMaker],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       PepaMadrigalWeatherMaker.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
