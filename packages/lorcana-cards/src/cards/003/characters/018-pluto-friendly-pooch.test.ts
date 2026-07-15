// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import {
//   PlutoDeterminedDefender,
//   PlutoFriendlyPooch,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe.skip("Pluto - Friendly Pooch", () => {
//   It("**GOOD DOG** {E} – You pay 1 {I} less for the next character you play this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: plutoDeterminedDefender.cost - 1,
//       Hand: [plutoDeterminedDefender],
//       Play: [plutoFriendlyPooch],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PlutoFriendlyPooch.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
