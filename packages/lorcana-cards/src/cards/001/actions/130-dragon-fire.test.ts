import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { dragonFireundefined } from "./130-dragon-fire";

describe("Dragon Fire - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [dragonFire] });
  //   Expect(testEngine.getCardModel(dragonFire).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dragon Fire", () => {
//   It("Banish chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: dragonFire.cost,
//       Hand: [dragonFire],
//       Play: [moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", dragonFire.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
