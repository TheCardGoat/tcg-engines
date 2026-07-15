// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DocLeaderOfTheSevenDwarfs,
//   HappyGoodNatured,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { dragonGem } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dragon Gem", () => {
//   Describe("**BRING BACK TO LIFE** {E}, 3 {I} − Return a character card with **Support** from your discard to your hand.", () => {
//     It("Returns a character with Support", () => {
//       Const testStore = new TestStore({
//         Inkwell: 3,
//         Play: [dragonGem],
//         Discard: [happyGoodNatured],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", dragonGem.id);
//       Const target = testStore.getByZoneAndId("discard", happyGoodNatured.id);
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("hand");
//     });
//
//     It("Returns a character without Support", () => {
//       Const testStore = new TestStore({
//         Inkwell: 3,
//         Play: [dragonGem],
//         Discard: [docLeaderOfTheSevenDwarfs],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", dragonGem.id);
//       Const target = testStore.getByZoneAndId(
//         "discard",
//         DocLeaderOfTheSevenDwarfs.id,
//       );
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ targets: [target] }, true);
//
//       Expect(target.zone).toEqual("discard");
//     });
//   });
// });
//
