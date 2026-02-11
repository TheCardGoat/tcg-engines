// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { slightlyLostBoy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Slightly - Lost Boy", () => {
//   It.skip("**THE FOX** If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: slightlyLostBoy.cost,
//       Play: [slightlyLostBoy],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", slightlyLostBoy.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
