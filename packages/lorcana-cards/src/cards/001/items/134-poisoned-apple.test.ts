import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { poisonedApple } from "./134-poisoned-apple";

describe("Poisoned Apple - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [poisonedApple] });
  //   Expect(testEngine.getCardModel(poisonedApple).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HeiheiBoatSnack,
//   JasmineQueenOfAgrabah,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { poisonedApple } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Poisoned Apple", () => {
//   Describe("**TAKE A BITE . . . ** 1 {I}, Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.", () => {
//     It("Princess", () => {
//       Const testStore = new TestStore({
//         Inkwell: 1,
//         Play: [poisonedApple, jasmineQueenOfAgrabah],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", poisonedApple.id);
//       Const target = testStore.getByZoneAndId("play", jasmineQueenOfAgrabah.id);
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//       Expect(target.zone).toEqual("discard");
//       Expect(cardUnderTest.zone).toEqual("discard");
//     });
//
//     It("Non-Princess", () => {
//       Const testStore = new TestStore({
//         Inkwell: 1,
//         Play: [poisonedApple, heiheiBoatSnack],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", poisonedApple.id);
//       Const target = testStore.getByZoneAndId("play", heiheiBoatSnack.id);
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//       Expect(target.meta.exerted).toBeTruthy();
//       Expect(target.zone).toEqual("play");
//       Expect(cardUnderTest.zone).toEqual("discard");
//     });
//   });
// });
//
