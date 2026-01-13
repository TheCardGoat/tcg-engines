// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { kakamoraMenacingSailor } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Kakamora - Menacing Sailor", () => {
//   it.skip("**PLUNDER** When you play this character, each opponent loses 1 Lore.", () => {
//     const testStore = new TestStore({
//       inkwell: kakamoraMenacingSailor.cost,
//       hand: [kakamoraMenacingSailor],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       kakamoraMenacingSailor.id,
//     );
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
