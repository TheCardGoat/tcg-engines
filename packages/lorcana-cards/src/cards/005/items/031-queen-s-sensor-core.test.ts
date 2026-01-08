// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { queensSensorCoreItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Queen's Sensor Core", () => {
//   it.skip("SYMBOL OF NOBILITY", () => {
//     const testStore = new TestStore({
//       inkwell: queensSensorCoreItem.cost,
//       play: [queensSensorCoreItem],
//     });
//
//     const cardUnderTest = testStore.getCard(queensSensorCoreItem);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
//
//   it.skip("Royal Search", () => {
//     const testStore = new TestStore({
//       inkwell: queensSensorCoreItem.cost,
//       play: [queensSensorCoreItem],
//     });
//
//     const cardUnderTest = testStore.getCard(queensSensorCoreItem);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
