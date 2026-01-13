import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { theNokkWaterSpirit } from "./160-the-nokk-water-spirit";

describe("The Nokk - Water Spirit", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [theNokkWaterSpirit],
    });

    const cardUnderTest = testEngine.getCardModel(theNokkWaterSpirit);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { theNokkWaterSpirit } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("The Nokk - Water Spirit", () => {
//   it("has ward", () => {
//     const testStore = new TestStore({
//       play: [theNokkWaterSpirit],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       theNokkWaterSpirit.id,
//     );
//
//     expect(cardUnderTest.hasWard).toEqual(true);
//   });
// });
//
