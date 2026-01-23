import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { happyGoodnatured } from "./011-happy-good-natured";

describe("Happy - Good-Natured", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [happyGoodnatured],
    });

    const cardUnderTest = testEngine.getCardModel(happyGoodnatured);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { happyGoodNatured } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Happy - Good-Natured", () => {
//   it("Support", () => {
//     const testStore = new TestStore({
//       play: [happyGoodNatured],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", happyGoodNatured.id);
//
//     expect(cardUnderTest.hasSupport).toEqual(true);
//   });
// });
//
