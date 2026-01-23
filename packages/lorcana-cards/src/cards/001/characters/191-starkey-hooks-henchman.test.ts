import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { starkeyHooksHenchman } from "./191-starkey-hooks-henchman";

describe("Starkey - Hook’s Henchman", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [starkeyHooksHenchman] });
  //   expect(testEngine.getCardModel(starkeyHooksHenchman).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, test } from "@jest/globals";
// import {
//   captainColonelsLieutenant,
//   johnSilverAlienPirate,
//   starkeyHooksHenchman,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Starkey - Hook's Henchman", () => {
//   describe("**AYE AYE, CAPTAIN** While you have a Captain character in play, this character gets +1 {L}.", () => {
//     test("No Captain in play", () => {
//       const testStore = new TestStore({
//         play: [starkeyHooksHenchman],
//       });
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         starkeyHooksHenchman.id,
//       );
//
//       expect(cardUnderTest.lore).toEqual(starkeyHooksHenchman.lore);
//     });
//
//     test("With Captain in play", () => {
//       const testStore = new TestStore({
//         play: [starkeyHooksHenchman, johnSilverAlienPirate],
//       });
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         starkeyHooksHenchman.id,
//       );
//
//       expect(cardUnderTest.lore).toEqual(starkeyHooksHenchman.lore + 1);
//     });
//
//     test("With Captain in play", () => {
//       const testStore = new TestStore({
//         play: [starkeyHooksHenchman, captainColonelsLieutenant],
//       });
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         starkeyHooksHenchman.id,
//       );
//
//       expect(cardUnderTest.lore).toEqual(starkeyHooksHenchman.lore + 1);
//     });
//   });
// });
//
