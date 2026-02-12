// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { steelChromicon } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Steel Chromicon", () => {
//   It.skip("**STEEL LIGHT** {E} – Deal 1 damage to chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: steelChromicon.cost,
//       Play: [steelChromicon],
//     });
//
//     Const cardUnderTest = testStore.getCard(steelChromicon);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
