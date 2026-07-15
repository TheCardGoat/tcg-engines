// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { scroopBackstabber } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Scroop - Backstabber", () => {
//   It.skip("**BRUTE** While this character has damage, he gets +3 {S}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: scroopBackstabber.cost,
//       Play: [scroopBackstabber],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ScroopBackstabber.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
