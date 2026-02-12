import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { fishboneQuill } from "./168-fishbone-quill";

describe("Fishbone Quill - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [fishboneQuill] });
  //   Expect(testEngine.getCardModel(fishboneQuill).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DingleHopper,
//   FishboneQuill,
// } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fishbone Quill", () => {
//   It("Go Ahead And Sign", () => {
//     Const testStore = new TestStore({
//       Hand: [dingleHopper],
//       Play: [fishboneQuill],
//     });
//     Const store = testStore.store;
//     Const tableStore = store.tableStore;
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", fishboneQuill.id);
//
//     Expect(
//       TableStore.getPlayerZone("player_one", "inkwell")?.cards,
//     ).toHaveLength(0);
//     Expect(tableStore.getPlayerZone("player_one", "hand")?.cards).toHaveLength(
//       1,
//     );
//
//     CardUnderTest.activate();
//
//     Const effect = store.stackLayerStore.layers[0];
//     If (effect) {
//       Const target = testStore.getByZoneAndId("hand", dingleHopper.id);
//
//       TestStore.store.stackLayerStore.resolveTopOfStack({
//         Targets: [target],
//       });
//     }
//
//     Expect(
//       TableStore.getPlayerZone("player_one", "inkwell")?.cards,
//     ).toHaveLength(1);
//     Expect(tableStore.getPlayerZone("player_one", "hand")?.cards).toHaveLength(
//       0,
//     );
//     Expect(testStore.getCard(dingleHopper).meta.exerted).toBeFalsy();
//     Expect(store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
