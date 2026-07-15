import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { beastundefined } from "./201-beast-mirror";

describe("Beast - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [beastMirror] });
  //   Expect(testEngine.getCardModel(beastMirror).hasKeyword()).toBe(true);
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
//   BeastMirror,
//   DingleHopper,
// } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Beast Mirror", () => {
//   Describe("Show Me - If you have no cards in your hand, draw a card.", () => {
//     It("Empty hand", () => {
//       Const testStore = new TestStore({
//         Deck: 1,
//         Inkwell: 4,
//         Play: [beastMirror],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", beastMirror.id);
//
//       Expect(
//         TestStore.store.tableStore.getPlayerZone("player_one", "deck")?.cards,
//       ).toHaveLength(1);
//
//       CardUnderTest.activate();
//
//       Expect(
//         TestStore.store.tableStore.getPlayerZone("player_one", "deck")?.cards,
//       ).toHaveLength(0);
//     });
//
//     It("Non Empty hand", () => {
//       Const testStore = new TestStore({
//         Deck: 1,
//         Play: [beastMirror],
//         Hand: [dingleHopper],
//         Inkwell: 3,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", beastMirror.id);
//
//       Expect(
//         TestStore.store.tableStore.getPlayerZone("player_one", "deck")?.cards,
//       ).toHaveLength(1);
//
//       CardUnderTest.activate();
//
//       // expect(cardUnderTest.ready).toBeFalsy();
//       Expect(
//         TestStore.store.tableStore.getPlayerZone("player_one", "deck")?.cards,
//       ).toHaveLength(1);
//       Expect(
//         TestStore.store.tableStore.getPlayerZone("player_one", "hand")?.cards,
//       ).toHaveLength(1);
//     });
//   });
// });
//
