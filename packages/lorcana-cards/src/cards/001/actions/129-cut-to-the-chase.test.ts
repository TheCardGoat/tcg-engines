import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { cutToTheChase } from "./129-cut-to-the-chase";

describe("Cut to the Chase - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [cutToTheChase] });
  //   expect(testEngine.getCardModel(cutToTheChase).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// import { describe, expect, it } from "@jest/globals";
// import { cutToTheChase } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Cut to the Chase", () => {
//   it("Chosen character gains **Rush** this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: cutToTheChase.cost,
//       hand: [cutToTheChase],
//       play: [moanaOfMotunui],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", cutToTheChase.id);
//     const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     expect(target.hasRush).toEqual(true);
//   });
// });
//
