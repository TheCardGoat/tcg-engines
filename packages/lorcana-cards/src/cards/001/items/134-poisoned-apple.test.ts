import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { poisonedApple } from "./134-poisoned-apple";

describe("Poisoned Apple - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [poisonedApple] });
  //   expect(testEngine.getCardModel(poisonedApple).hasKeyword()).toBe(true);
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
//   heiheiBoatSnack,
//   jasmineQueenOfAgrabah,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { poisonedApple } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Poisoned Apple", () => {
//   describe("**TAKE A BITE . . . ** 1 {I}, Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.", () => {
//     it("Princess", () => {
//       const testStore = new TestStore({
//         inkwell: 1,
//         play: [poisonedApple, jasmineQueenOfAgrabah],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId("play", poisonedApple.id);
//       const target = testStore.getByZoneAndId("play", jasmineQueenOfAgrabah.id);
//
//       cardUnderTest.activate();
//       testStore.resolveTopOfStack({ targetId: target.instanceId });
//
//       expect(target.zone).toEqual("discard");
//       expect(cardUnderTest.zone).toEqual("discard");
//     });
//
//     it("Non-Princess", () => {
//       const testStore = new TestStore({
//         inkwell: 1,
//         play: [poisonedApple, heiheiBoatSnack],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId("play", poisonedApple.id);
//       const target = testStore.getByZoneAndId("play", heiheiBoatSnack.id);
//
//       cardUnderTest.activate();
//       testStore.resolveTopOfStack({ targetId: target.instanceId });
//
//       expect(target.meta.exerted).toBeTruthy();
//       expect(target.zone).toEqual("play");
//       expect(cardUnderTest.zone).toEqual("discard");
//     });
//   });
// });
//
