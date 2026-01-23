import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { kaaSuspiciousSerpent } from "./072-kaa-suspicious-serpent";

describe("Kaa - Suspicious Serpent", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kaaSuspiciousSerpent],
    });

    const cardUnderTest = testEngine.getCardModel(kaaSuspiciousSerpent);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { kaaSuspiciousSerpent } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Kaa - Suspicious Serpent", () => {
//   it("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     const testEngine = new TestEngine({
//       play: [kaaSuspiciousSerpent],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(kaaSuspiciousSerpent);
//     expect(cardUnderTest.hasWard).toBe(true);
//   });
// });
//
