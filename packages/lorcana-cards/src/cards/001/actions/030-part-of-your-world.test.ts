// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { partOfYourWorld } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Part of Your World", () => {
//   It("Return a character card from your discard to your hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: partOfYourWorld.cost,
//       Hand: [partOfYourWorld],
//       Discard: [moanaOfMotunui],
//     });
//     Const cardUnderTest = testStore.getByZoneAndId("hand", partOfYourWorld.id);
//
//     CardUnderTest.playFromHand();
//
//     Const target = testStore.getByZoneAndId("discard", moanaOfMotunui.id);
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("hand");
//   });
// });
//
