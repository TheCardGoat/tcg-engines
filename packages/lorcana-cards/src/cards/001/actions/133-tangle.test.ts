import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { tangle } from "./133-tangle";

describe("tangle - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [tangle] });
  //   Expect(testEngine.getCardModel(tangle).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tangle } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tangle", () => {
//   It("Each opponent loses 1 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: tangle.cost,
//       Hand: [tangle],
//     });
//
//     TestStore.store.tableStore.getTable("player_two").lore = 5;
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", tangle.id);
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
//   });
// });
//
