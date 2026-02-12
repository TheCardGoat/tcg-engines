import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { cutToTheChase } from "./129-cut-to-the-chase";

describe("Cut to the Chase - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [cutToTheChase] });
  //   Expect(testEngine.getCardModel(cutToTheChase).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import { cutToTheChase } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cut to the Chase", () => {
//   It("Chosen character gains **Rush** this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: cutToTheChase.cost,
//       Hand: [cutToTheChase],
//       Play: [moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", cutToTheChase.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.hasRush).toEqual(true);
//   });
// });
//
