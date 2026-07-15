import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { oneJumpAhead } from "./164-one-jump-ahead";

describe("One Jump Ahead - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [oneJumpAhead] });
  //   Expect(testEngine.getCardModel(oneJumpAhead).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { oneJumpAhead } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("One Jump Ahead", () => {
//   It("Put the top card of your deck into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: oneJumpAhead.cost,
//       Hand: [oneJumpAhead],
//       Deck: [dingleHopper],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", oneJumpAhead.id);
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//
//     Expect(testStore.getZonesCardCount().inkwell).toEqual(
//       OneJumpAhead.cost + 1,
//     );
//     Expect(
//       TestStore.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toEqual(0);
//   });
// });
//
