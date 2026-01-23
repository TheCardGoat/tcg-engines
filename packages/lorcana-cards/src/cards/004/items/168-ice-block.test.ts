// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { iceBlock } from "@lorcanito/lorcana-engine/cards/004/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ice Block", () => {
//   it.skip("**CHILLY LABOR** {E} − Chosen character gets -1 {S} this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: iceBlock.cost,
//       play: [iceBlock],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", iceBlock.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
