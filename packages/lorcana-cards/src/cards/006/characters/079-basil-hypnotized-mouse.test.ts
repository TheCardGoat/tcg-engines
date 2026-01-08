import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { basilHypnotizedMouse } from "./079-basil-hypnotized-mouse";

describe("Basil - Hypnotized Mouse", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [basilHypnotizedMouse],
    });

    const cardUnderTest = testEngine.getCardModel(basilHypnotizedMouse);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { basilHypnotizedMouse } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Basil - Hypnotized Mouse", () => {
//   it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [basilHypnotizedMouse],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(basilHypnotizedMouse);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
