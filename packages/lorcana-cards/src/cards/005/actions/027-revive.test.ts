// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { revive } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Revive", () => {
//   it.skip("Play a character card with cost 5 or less from your discard for free.", () => {
//     const testStore = new TestStore({
//       inkwell: revive.cost,
//       hand: [revive],
//     });
//
//     const cardUnderTest = testStore.getCard(revive);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
