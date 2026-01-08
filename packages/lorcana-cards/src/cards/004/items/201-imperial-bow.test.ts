// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { imperialBow } from "@lorcanito/lorcana-engine/cards/004/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Imperial Bow", () => {
//   it.skip("**WITHIN RANGE** {E}, 1 {I} − Chosen Hero character gains **Challenger** +2 and **Evasive** this turn. _(They get +2 {S} while challenging. They can challenge characters with Evasive.)_", () => {
//     const testStore = new TestStore({
//       inkwell: imperialBow.cost,
//       play: [imperialBow],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", imperialBow.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
