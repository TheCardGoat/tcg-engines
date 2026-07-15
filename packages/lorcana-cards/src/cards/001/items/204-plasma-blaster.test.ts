import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { plasmaBlaster } from "./204-plasma-blaster";

describe("Quick Shot - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [plasmaBlaster] });
  //   Expect(testEngine.getCardModel(plasmaBlaster).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   DingleHopper,
//   PlasmaBlaster,
// } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Plasma Blaster", () => {
//   It("Quick shot - Deal 1 damage to chosen character.", () => {
//     Const testStore = new TestStore({
//       Play: [plasmaBlaster, mickeyMouseTrueFriend],
//       Inkwell: [dingleHopper, dingleHopper],
//     });
//
//     Const damagedChar = testStore.getByZoneAndId(
//       "play",
//       MickeyMouseTrueFriend.id,
//     );
//     DamagedChar.updateCardMeta({ damage: 1 });
//     Expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 1 }));
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", plasmaBlaster.id);
//
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     CardUnderTest.activate();
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
//
//     Const effect = testStore.store.stackLayerStore.layers[0];
//     If (effect) {
//       TestStore.resolveTopOfStack({
//         Targets: [damagedChar],
//       });
//     }
//
//     Expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 2 }));
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
