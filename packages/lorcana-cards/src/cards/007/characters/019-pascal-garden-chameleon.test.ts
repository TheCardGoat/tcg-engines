import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { pascalGardenChameleon } from "./019-pascal-garden-chameleon";

describe("Pascal - Garden Chameleon", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [pascalGardenChameleon],
    });

    const cardUnderTest = testEngine.getCardModel(pascalGardenChameleon);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { pascalGardenChameleon } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pascal - Garden Chameleon", () => {
//   it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [pascalGardenChameleon],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(pascalGardenChameleon);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
