// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import {
//   plutoDeterminedDefender,
//   plutoFriendlyPooch,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe.skip("Pluto - Friendly Pooch", () => {
//   it("**GOOD DOG** {E} – You pay 1 {I} less for the next character you play this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: plutoDeterminedDefender.cost - 1,
//       hand: [plutoDeterminedDefender],
//       play: [plutoFriendlyPooch],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       plutoFriendlyPooch.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
