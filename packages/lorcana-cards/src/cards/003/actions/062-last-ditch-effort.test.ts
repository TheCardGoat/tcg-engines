// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { lastDitchEffort } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Last-Ditch Effort", () => {
//   It.skip("Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)", () => {
//     Const testStore = new TestStore({
//       Inkwell: lastDitchEffort.cost,
//       Hand: [lastDitchEffort],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", lastDitchEffort.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
