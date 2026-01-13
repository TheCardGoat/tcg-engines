// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { camiloMadrigalPrankster } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Camilo Madrigal - Prankster", () => {
//   it.skip("**MANY FORMS** At the start of your turn, you may chose one:• This character gets +1 {L} this turn.• This character gain **Challenger** +2 this turn. _(While challenging, this character gets +2 {S}.)_", () => {
//     const testStore = new TestStore({
//       inkwell: camiloMadrigalPrankster.cost,
//       play: [camiloMadrigalPrankster],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       camiloMadrigalPrankster.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
