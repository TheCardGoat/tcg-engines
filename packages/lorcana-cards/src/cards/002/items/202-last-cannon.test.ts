// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arthurTrainedSwordsman } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { lastCannon } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Last Cannon", () => {
//   It("**ARM YOURSELF** 1 {I}, Banish this item − Chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_", () => {
//     Const testStore = new TestStore({
//       Play: [lastCannon, arthurTrainedSwordsman],
//       Inkwell: 1,
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", lastCannon.id);
//     Const target = testStore.getByZoneAndId("play", arthurTrainedSwordsman.id);
//
//     Expect(target.hasChallenger).toBeFalsy();
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasChallenger).toBeTruthy();
//     Expect(cardUnderTest.zone).toEqual("discard");
//   });
// });
//
