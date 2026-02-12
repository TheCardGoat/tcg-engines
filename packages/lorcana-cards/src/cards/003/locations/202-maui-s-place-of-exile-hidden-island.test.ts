// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mauisPlaceOfExileHiddenIsland } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maui's Place of Exile - Hidden Island", () => {
//   It.skip("**ISOLATED** Characters gain **Resist** +1 while here. _(Damage dealt to them is reduced by 1.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: mauisPlaceOfExileHiddenIsland.cost,
//       Play: [mauisPlaceOfExileHiddenIsland],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MauisPlaceOfExileHiddenIsland.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
