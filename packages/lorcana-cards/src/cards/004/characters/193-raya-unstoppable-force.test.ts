// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { rayaUnstoppableForce } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Raya - Unstoppable Force", () => {
//   it.skip("**Challenger +2** _(While challenging, this character gets +2 {S}.)_**Resist +2** _(Damage dealt to this character is reduced by 2.)_**YOU GAVE IT YOUR BEST** During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
//     const testStore = new TestStore({
//       inkwell: rayaUnstoppableForce.cost,
//       play: [rayaUnstoppableForce],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       rayaUnstoppableForce.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
