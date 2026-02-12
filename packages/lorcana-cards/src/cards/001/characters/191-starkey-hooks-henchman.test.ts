import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { starkeyHooksHenchman } from "./191-starkey-hooks-henchman";

describe("Starkey - Hook’s Henchman", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [starkeyHooksHenchman] });
  //   Expect(testEngine.getCardModel(starkeyHooksHenchman).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, test } from "@jest/globals";
// Import {
//   CaptainColonelsLieutenant,
//   JohnSilverAlienPirate,
//   StarkeyHooksHenchman,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Starkey - Hook's Henchman", () => {
//   Describe("**AYE AYE, CAPTAIN** While you have a Captain character in play, this character gets +1 {L}.", () => {
//     Test("No Captain in play", () => {
//       Const testStore = new TestStore({
//         Play: [starkeyHooksHenchman],
//       });
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         StarkeyHooksHenchman.id,
//       );
//
//       Expect(cardUnderTest.lore).toEqual(starkeyHooksHenchman.lore);
//     });
//
//     Test("With Captain in play", () => {
//       Const testStore = new TestStore({
//         Play: [starkeyHooksHenchman, johnSilverAlienPirate],
//       });
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         StarkeyHooksHenchman.id,
//       );
//
//       Expect(cardUnderTest.lore).toEqual(starkeyHooksHenchman.lore + 1);
//     });
//
//     Test("With Captain in play", () => {
//       Const testStore = new TestStore({
//         Play: [starkeyHooksHenchman, captainColonelsLieutenant],
//       });
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         StarkeyHooksHenchman.id,
//       );
//
//       Expect(cardUnderTest.lore).toEqual(starkeyHooksHenchman.lore + 1);
//     });
//   });
// });
//
