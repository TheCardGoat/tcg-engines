import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Gaston - Baritone Bully", () => {
  it("should have Singer 5 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [gastonBaritoneBully],
    });

    const cardUnderTest = testEngine.getCardModel(gastonBaritoneBully);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { gastonBaritoneBully } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Gaston - Baritone Bully", () => {
//   it("Singer", () => {
//     const testStore = new TestStore({
//       inkwell: gastonBaritoneBully.cost,
//       play: [gastonBaritoneBully],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       gastonBaritoneBully.id,
//     );
//
//     expect(cardUnderTest.hasSinger).toEqual(true);
//   });
// });
//
