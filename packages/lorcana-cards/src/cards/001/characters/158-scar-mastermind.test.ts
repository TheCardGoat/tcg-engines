import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { scarMastermind } from "./158-scar-mastermind";

describe("Scar - Mastermind", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [scarMastermind] });
  //   expect(testEngine.getCardModel(scarMastermind).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// import { describe, expect, it } from "@jest/globals";
// import {
//   scarMastermind,
//   tamatoaSoShiny,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Scar Mastermind", () => {
//   it("DISARMING Beauty effect - Chosen characters gets -2 {S} this turn.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: scarMastermind.cost,
//         hand: [scarMastermind],
//       },
//       {
//         play: [tamatoaSoShiny],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", scarMastermind.id);
//     const target = testStore.getByZoneAndId(
//       "play",
//       tamatoaSoShiny.id,
//       "player_two",
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) - 5);
//   });
// });
//
