import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { eyeOfTheFates } from "./167-eye-of-the-fates";

describe("Eye of the Fates - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [eyeOfTheFate] });
  //   Expect(testEngine.getCardModel(eyeOfTheFate).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { eyeOfTheFate } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Eye of the Fates", () => {
//   It("See the Future - Chosen character gets +1 {L} this turn.", () => {
//     Const testStore = new TestStore({
//       Play: [eyeOfTheFate, mickeyMouseTrueFriend],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", eyeOfTheFate.id);
//     Const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);
//     Const lore = target.lorcanitoCard.lore || 0;
//
//     CardUnderTest.activate();
//
//     Expect(target.lore).toEqual(lore);
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//     Expect(target.lore).toEqual((lore || 0) + 1);
//   });
// });
//
