import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { simbaReturnedKing } from "./189-simba-returned-king";

describe("Simba - Returned King", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [simbaReturnedKing] });
  //   Expect(testEngine.getCardModel(simbaReturnedKing).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { simbaReturnedKing } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Simba - Returned King", () => {
//   Describe("POUNCE: During your turn, this character gains **Evasive**.", () => {
//     It("During your turn.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [simbaReturnedKing],
//         },
//         {
//           Play: [simbaReturnedKing],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         SimbaReturnedKing.id,
//       );
//
//       Expect(cardUnderTest.hasEvasive).toBeTruthy();
//     });
//
//     It("During opponent's turn.", () => {
//       Const testStore = new TestStore(
//         {},
//         {
//           Play: [simbaReturnedKing],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         SimbaReturnedKing.id,
//         "player_two",
//       );
//
//       Expect(cardUnderTest.hasEvasive).toBeFalsy();
//     });
//   });
// });
//
