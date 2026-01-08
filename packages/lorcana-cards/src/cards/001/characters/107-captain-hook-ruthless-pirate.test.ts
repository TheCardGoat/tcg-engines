import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { captainHookRuthlessPirate } from "./107-captain-hook-ruthless-pirate";

describe("Captain Hook - Ruthless Pirate", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [captainHookRecklessPirate] });
  //   expect(testEngine.getCardModel(captainHookRecklessPirate).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   captainHookRecklessPirate,
//   goofyDaredevil,
//   minniMouseAlwaysClassy,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Captain Hook - Ruthless Pirate", () => {
//   it("Rush", () => {
//     const testStore = new TestStore({
//       play: [captainHookRecklessPirate],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       captainHookRecklessPirate.id,
//     );
//
//     expect(cardUnderTest.hasRush).toEqual(true);
//   });
//
//   it("**YOU COWARD!** While this character is exerted, opposing characters with **Evasive** gain **Reckless**.", () => {
//     const testStore = new TestStore(
//       {
//         play: [captainHookRecklessPirate],
//       },
//       {
//         play: [goofyDaredevil, minniMouseAlwaysClassy],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       captainHookRecklessPirate.id,
//     );
//     const opponentWithEvasive = testStore.getByZoneAndId(
//       "play",
//       goofyDaredevil.id,
//       "player_two",
//     );
//     const opponentWithoutEvasive = testStore.getByZoneAndId(
//       "play",
//       minniMouseAlwaysClassy.id,
//       "player_two",
//     );
//
//     expect(opponentWithEvasive.hasEvasive).toEqual(true);
//     expect(opponentWithEvasive.hasReckless).toEqual(false);
//     expect(opponentWithoutEvasive.hasEvasive).toEqual(false);
//     expect(opponentWithoutEvasive.hasReckless).toEqual(false);
//
//     cardUnderTest.updateCardMeta({ exerted: true });
//
//     expect(opponentWithEvasive.hasEvasive).toEqual(true);
//     expect(opponentWithEvasive.hasReckless).toEqual(true);
//     expect(opponentWithoutEvasive.hasEvasive).toEqual(false);
//     expect(opponentWithoutEvasive.hasReckless).toEqual(false);
//   });
// });
//
