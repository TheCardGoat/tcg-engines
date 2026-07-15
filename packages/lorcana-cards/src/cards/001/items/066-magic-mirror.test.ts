import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { magicMirrorundefined } from "./066-magic-mirror";

describe("Magic Mirror - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [magicMirror] });
  //   Expect(testEngine.getCardModel(magicMirror).hasKeyword()).toBe(true);
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
//   MagicMirror,
// } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magic Mirror", () => {
//   It("Speak - Drawing one", () => {
//     Const testStore = new TestStore({
//       Deck: [dingleHopper],
//       Play: [magicMirror],
//       Inkwell: [dingleHopper, dingleHopper, dingleHopper, dingleHopper],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", magicMirror.id);
//
//     Expect(
//       TestStore.store.tableStore.getPlayerZone("player_one", "deck")?.cards,
//     ).toHaveLength(1);
//
//     CardUnderTest.activate();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0 }),
//     );
//   });
// });
//
