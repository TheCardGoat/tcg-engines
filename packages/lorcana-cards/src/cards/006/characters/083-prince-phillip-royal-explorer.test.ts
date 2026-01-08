import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { princePhillipRoyalExplorer } from "./083-prince-phillip-royal-explorer";

describe("Prince Phillip - Royal Explorer", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [princePhillipRoyalExplorer],
    });

    const cardUnderTest = testEngine.getCardModel(princePhillipRoyalExplorer);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { princePhillipRoyalExplorer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Prince Phillip - Royal Explorer", () => {
//   it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     const testEngine = new TestEngine({
//       play: [princePhillipRoyalExplorer],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(princePhillipRoyalExplorer);
//     expect(cardUnderTest.hasWard).toBe(true);
//   });
// });
//
