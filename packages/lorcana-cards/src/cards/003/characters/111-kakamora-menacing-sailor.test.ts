// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { kakamoraMenacingSailor } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Kakamora - Menacing Sailor", () => {
//   It.skip("**PLUNDER** When you play this character, each opponent loses 1 Lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: kakamoraMenacingSailor.cost,
//       Hand: [kakamoraMenacingSailor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       KakamoraMenacingSailor.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
