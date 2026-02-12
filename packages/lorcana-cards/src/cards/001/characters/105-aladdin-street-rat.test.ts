import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { aladdinStreetRat } from "./105-aladdin-street-rat";

describe("Aladdin - Street Rat", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [aladdinStreetRat] });
  //   Expect(testEngine.getCardModel(aladdinStreetRat).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { aladdinStreetRat } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Aladdin - Street Rat", () => {
//   Describe("**IMPROVISE** When you play this character each opponent loses 1 lore.", () => {
//     It("Opponent loses lore", () => {
//       Const testStore = new TestStore({
//         Inkwell: aladdinStreetRat.cost,
//         Hand: [aladdinStreetRat],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         AladdinStreetRat.id,
//       );
//
//       TestStore.store.tableStore.getTable("player_two").lore = 5;
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
//     });
//   });
// });
//
