// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rlsLegacysCannon } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("RLS Legacy's Cannon", () => {
//   It.skip("**BA-BOOM!** {E}, 2 {I}, Discard a card - Deal 2 damage to chosen character or location.", () => {
//     Const testStore = new TestStore({
//       Inkwell: rlsLegacysCannon.cost,
//       Play: [rlsLegacysCannon],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", rlsLegacysCannon.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
