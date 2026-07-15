import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { whiteRabbitundefined } from "./068-white-rabbit-pocket-watch";

describe("White Rabbit - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [whiteRabbitPocketWatch] });
  //   Expect(testEngine.getCardModel(whiteRabbitPocketWatch).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { whiteRabbitPocketWatch } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("White Rabbit's Pocket Watch", () => {
//   It("I'm late - Chosen character gains **Rush** this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 1,
//       Play: [whiteRabbitPocketWatch, moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       WhiteRabbitPocketWatch.id,
//     );
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.hasRush).toEqual(true);
//   });
// });
//
