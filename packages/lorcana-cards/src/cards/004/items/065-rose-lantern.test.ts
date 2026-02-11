// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { roseLantern } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rose Lantern", () => {
//   It.skip("MYSTERICAL PETALS  {E}, 2 {I} − Move 1 damage counter from chosen character to chosen opposing character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: roseLantern.cost,
//       Play: [roseLantern],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", roseLantern.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
