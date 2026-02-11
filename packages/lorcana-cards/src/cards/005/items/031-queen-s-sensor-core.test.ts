// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { queensSensorCoreItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Queen's Sensor Core", () => {
//   It.skip("SYMBOL OF NOBILITY", () => {
//     Const testStore = new TestStore({
//       Inkwell: queensSensorCoreItem.cost,
//       Play: [queensSensorCoreItem],
//     });
//
//     Const cardUnderTest = testStore.getCard(queensSensorCoreItem);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("Royal Search", () => {
//     Const testStore = new TestStore({
//       Inkwell: queensSensorCoreItem.cost,
//       Play: [queensSensorCoreItem],
//     });
//
//     Const cardUnderTest = testStore.getCard(queensSensorCoreItem);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
