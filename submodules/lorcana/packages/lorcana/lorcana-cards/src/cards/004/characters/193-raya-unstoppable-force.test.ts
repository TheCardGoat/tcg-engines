// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rayaUnstoppableForce } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Raya - Unstoppable Force", () => {
//   It.skip("**Challenger +2** _(While challenging, this character gets +2 {S}.)_**Resist +2** _(Damage dealt to this character is reduced by 2.)_**YOU GAVE IT YOUR BEST** During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: rayaUnstoppableForce.cost,
//       Play: [rayaUnstoppableForce],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       RayaUnstoppableForce.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
