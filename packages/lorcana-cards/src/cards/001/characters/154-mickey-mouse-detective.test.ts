import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { mickeyMouseDetective } from "./154-mickey-mouse-detective";

describe("Mickey Mouse - Detective", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [mickeyMouseDetective] });
  //   expect(testEngine.getCardModel(mickeyMouseDetective).hasKeyword()).toBe(true);
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
//   mauriceWorldFamousInventor,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mickey Mouse - Detective", () => {
//   it("**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
//     const testStore = new TestStore({
//       inkwell: mickeyMouseDetective.cost,
//       deck: [mauriceWorldFamousInventor],
//       hand: [mickeyMouseDetective],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       mickeyMouseDetective.id,
//     );
//
//     const topDeckCard = testStore.getByZoneAndId(
//       "deck",
//       mauriceWorldFamousInventor.id,
//     );
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({ targets: [topDeckCard] });
//
//     expect(topDeckCard.zone).toEqual("inkwell");
//     expect(topDeckCard.ready).toEqual(false);
//     expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
