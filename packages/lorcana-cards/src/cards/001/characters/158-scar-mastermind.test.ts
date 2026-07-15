import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { scarMastermind } from "./158-scar-mastermind";

describe("Scar - Mastermind", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [scarMastermind] });
  //   Expect(testEngine.getCardModel(scarMastermind).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ScarMastermind,
//   TamatoaSoShiny,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Scar Mastermind", () => {
//   It("DISARMING Beauty effect - Chosen characters gets -2 {S} this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: scarMastermind.cost,
//         Hand: [scarMastermind],
//       },
//       {
//         Play: [tamatoaSoShiny],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", scarMastermind.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       TamatoaSoShiny.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) - 5);
//   });
// });
//
