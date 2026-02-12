// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { queenOfHeartsImpulsiveRuler } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Queen of Hearts - Impulsive Ruler", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: queenOfHeartsImpulsiveRuler.cost,
//       Play: [queenOfHeartsImpulsiveRuler],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       QueenOfHeartsImpulsiveRuler.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
