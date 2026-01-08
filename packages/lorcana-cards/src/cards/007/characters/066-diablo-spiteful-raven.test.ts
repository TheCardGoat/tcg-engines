import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { diabloSpitefulRaven } from "./066-diablo-spiteful-raven";

describe("Diablo - Spiteful Raven", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [diabloSpitefulRaven],
    });

    const cardUnderTest = testEngine.getCardModel(diabloSpitefulRaven);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [diabloSpitefulRaven],
    });

    const cardUnderTest = testEngine.getCardModel(diabloSpitefulRaven);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { diabloSpitefulRaven } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Diablo - Spiteful Raven", () => {
//   it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [diabloSpitefulRaven],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(diabloSpitefulRaven);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it.skip("Challenger +2 (While challenging, this character gets +2 {S})", async () => {
//     const testEngine = new TestEngine({
//       play: [diabloSpitefulRaven],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(diabloSpitefulRaven);
//     expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
