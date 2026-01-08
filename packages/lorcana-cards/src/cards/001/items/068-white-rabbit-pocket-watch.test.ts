import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { whiteRabbitundefined } from "./068-white-rabbit-pocket-watch";

describe("White Rabbit - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [whiteRabbitPocketWatch] });
  //   expect(testEngine.getCardModel(whiteRabbitPocketWatch).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// import { describe, expect, it } from "@jest/globals";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { whiteRabbitPocketWatch } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("White Rabbit's Pocket Watch", () => {
//   it("I'm late - Chosen character gains **Rush** this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: 1,
//       play: [whiteRabbitPocketWatch, moanaOfMotunui],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       whiteRabbitPocketWatch.id,
//     );
//     const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     cardUnderTest.activate();
//     testStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     expect(target.hasRush).toEqual(true);
//   });
// });
//
