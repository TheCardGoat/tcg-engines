import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { herculesTrueHero } from "./191-hercules-true-hero";

describe("Hercules - True Hero", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesTrueHero],
    });

    const cardUnderTest = testEngine.getCardModel(herculesTrueHero);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { herculesTrueHero } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hercules - True Hero", () => {
//   it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", async () => {
//     const testEngine = new TestEngine({
//       play: [herculesTrueHero],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(herculesTrueHero);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
