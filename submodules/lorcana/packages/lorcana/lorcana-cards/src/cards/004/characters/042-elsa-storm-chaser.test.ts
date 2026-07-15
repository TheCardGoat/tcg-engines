// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { elsaStormChaser } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Elsa - Storm Chaser", () => {
//   It.skip("**TEMPEST** {E}− Chosen character gains **Challenger** +2 and **Rush** this turn. _(They get +2 {S} while challenging. They can challenge the turn they're played.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: elsaStormChaser.cost,
//       Play: [elsaStormChaser],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", elsaStormChaser.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
