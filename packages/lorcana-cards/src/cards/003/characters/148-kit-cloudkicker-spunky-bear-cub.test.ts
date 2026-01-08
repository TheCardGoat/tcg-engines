import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { kitCloudkickerSpunkyBearCub } from "./148-kit-cloudkicker-spunky-bear-cub";

describe("Kit Cloudkicker - Spunky Bear Cub", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kitCloudkickerSpunkyBearCub],
    });

    const cardUnderTest = testEngine.getCardModel(kitCloudkickerSpunkyBearCub);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { kitCloudkickerSpunkyBearCub } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Kit Cloudkicker - Spunky Bear Cub", () => {
//   it.skip("**Ward** (Opponents can't choose this character except to challenge.)", () => {
//     const testStore = new TestStore({
//       play: [kitCloudkickerSpunkyBearCub],
//     });
//
//     const cardUnderTest = testStore.getCard(kitCloudkickerSpunkyBearCub);
//     expect(cardUnderTest.hasWard).toBe(true);
//   });
// });
//
