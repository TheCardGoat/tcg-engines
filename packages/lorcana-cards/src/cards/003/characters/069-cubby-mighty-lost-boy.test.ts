// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { cubbyMightyLostBoy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cubby - Mighty Lost Boy", () => {
//   It.skip("**THE BEAR** Whenever this character moves to a location, he gets +3 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: cubbyMightyLostBoy.cost,
//       Play: [cubbyMightyLostBoy],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CubbyMightyLostBoy.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
