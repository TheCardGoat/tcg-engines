// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { lastDitchEffort } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Last-Ditch Effort", () => {
//   it.skip("Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)", () => {
//     const testStore = new TestStore({
//       inkwell: lastDitchEffort.cost,
//       hand: [lastDitchEffort],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", lastDitchEffort.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
