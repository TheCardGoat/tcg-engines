// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { elsaGlovesOff } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Elsa - Gloves Off", () => {
//   it.skip("**Challenger** +3 _(While challenging, this character gets +3 {S})_", () => {
//     const testStore = new TestStore({
//       inkwell: elsaGlovesOff.cost,
//
//       play: [elsaGlovesOff],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", elsaGlovesOff.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
