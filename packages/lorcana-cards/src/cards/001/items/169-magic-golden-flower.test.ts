import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { magicGoldenFlower } from "./169-magic-golden-flower";

describe("Magic Golden Flower - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [magicGoldenFlower] });
  //   Expect(testEngine.getCardModel(magicGoldenFlower).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arielOnHumanLegs } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { magicGoldenFlower } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magic Golden Flower", () => {
//   It("Healing Pollen - healing 3 damage", () => {
//     Const testStore = new TestStore({
//       Play: [magicGoldenFlower, arielOnHumanLegs],
//     });
//
//     Const damagedChar = testStore.getByZoneAndId("play", arielOnHumanLegs.id);
//     DamagedChar.updateCardMeta({ damage: 3 });
//     Expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 3 }));
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MagicGoldenFlower.id,
//     );
//
//     CardUnderTest.activate();
//
//     TestStore.resolveTopOfStack({
//       TargetId: damagedChar.instanceId,
//     });
//
//     Expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 0 }));
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Play: 1,
//         Discard: 1,
//       }),
//     );
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
//
//   It("Can undo", () => {
//     // TODO: implement undo
//     Expect(true).toBe(true);
//   });
// });
//
