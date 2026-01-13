// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { cubbyMightyLostBoy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Cubby - Mighty Lost Boy", () => {
//   it.skip("**THE BEAR** Whenever this character moves to a location, he gets +3 {S} this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: cubbyMightyLostBoy.cost,
//       play: [cubbyMightyLostBoy],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       cubbyMightyLostBoy.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
