// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { steelChromicon } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Steel Chromicon", () => {
//   it.skip("**STEEL LIGHT** {E} – Deal 1 damage to chosen character.", () => {
//     const testStore = new TestStore({
//       inkwell: steelChromicon.cost,
//       play: [steelChromicon],
//     });
//
//     const cardUnderTest = testStore.getCard(steelChromicon);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
