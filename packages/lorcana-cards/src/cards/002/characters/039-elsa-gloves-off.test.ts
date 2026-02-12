// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { elsaGlovesOff } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Elsa - Gloves Off", () => {
//   It.skip("**Challenger** +3 _(While challenging, this character gets +3 {S})_", () => {
//     Const testStore = new TestStore({
//       Inkwell: elsaGlovesOff.cost,
//
//       Play: [elsaGlovesOff],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", elsaGlovesOff.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
