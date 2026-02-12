// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { kuzcosPalaceHomeOfTheEmperor } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Kuzco's Palace - Home of the Emperor", () => {
//   It.skip("**CITY WALLS** Whenever a character is challenged and banished while here, banish the challenging character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: kuzcosPalaceHomeOfTheEmperor.cost,
//       Play: [kuzcosPalaceHomeOfTheEmperor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       KuzcosPalaceHomeOfTheEmperor.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
