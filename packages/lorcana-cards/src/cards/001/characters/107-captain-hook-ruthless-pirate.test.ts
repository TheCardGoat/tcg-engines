import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { captainHookRuthlessPirate } from "./107-captain-hook-ruthless-pirate";

describe("Captain Hook - Ruthless Pirate", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [captainHookRecklessPirate] });
  //   Expect(testEngine.getCardModel(captainHookRecklessPirate).hasKeyword()).toBe(true);
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
//   CaptainHookRecklessPirate,
//   GoofyDaredevil,
//   MinniMouseAlwaysClassy,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Captain Hook - Ruthless Pirate", () => {
//   It("Rush", () => {
//     Const testStore = new TestStore({
//       Play: [captainHookRecklessPirate],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CaptainHookRecklessPirate.id,
//     );
//
//     Expect(cardUnderTest.hasRush).toEqual(true);
//   });
//
//   It("**YOU COWARD!** While this character is exerted, opposing characters with **Evasive** gain **Reckless**.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [captainHookRecklessPirate],
//       },
//       {
//         Play: [goofyDaredevil, minniMouseAlwaysClassy],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CaptainHookRecklessPirate.id,
//     );
//     Const opponentWithEvasive = testStore.getByZoneAndId(
//       "play",
//       GoofyDaredevil.id,
//       "player_two",
//     );
//     Const opponentWithoutEvasive = testStore.getByZoneAndId(
//       "play",
//       MinniMouseAlwaysClassy.id,
//       "player_two",
//     );
//
//     Expect(opponentWithEvasive.hasEvasive).toEqual(true);
//     Expect(opponentWithEvasive.hasReckless).toEqual(false);
//     Expect(opponentWithoutEvasive.hasEvasive).toEqual(false);
//     Expect(opponentWithoutEvasive.hasReckless).toEqual(false);
//
//     CardUnderTest.updateCardMeta({ exerted: true });
//
//     Expect(opponentWithEvasive.hasEvasive).toEqual(true);
//     Expect(opponentWithEvasive.hasReckless).toEqual(true);
//     Expect(opponentWithoutEvasive.hasEvasive).toEqual(false);
//     Expect(opponentWithoutEvasive.hasReckless).toEqual(false);
//   });
// });
//
