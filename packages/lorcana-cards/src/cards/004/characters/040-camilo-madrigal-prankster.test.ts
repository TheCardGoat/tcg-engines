// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { camiloMadrigalPrankster } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Camilo Madrigal - Prankster", () => {
//   It.skip("**MANY FORMS** At the start of your turn, you may chose one:• This character gets +1 {L} this turn.• This character gain **Challenger** +2 this turn. _(While challenging, this character gets +2 {S}.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: camiloMadrigalPrankster.cost,
//       Play: [camiloMadrigalPrankster],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CamiloMadrigalPrankster.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
