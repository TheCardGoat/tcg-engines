import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { dragonFireundefined } from "./130-dragon-fire";

describe("Dragon Fire - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [dragonFire] });
  //   expect(testEngine.getCardModel(dragonFire).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Dragon Fire", () => {
//   it("Banish chosen character.", () => {
//     const testStore = new TestStore({
//       inkwell: dragonFire.cost,
//       hand: [dragonFire],
//       play: [moanaOfMotunui],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", dragonFire.id);
//     const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveTopOfStack({
//       targetId: target.instanceId,
//     });
//
//     expect(target.zone).toEqual("discard");
//   });
// });
//
