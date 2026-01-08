import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { tukTukDisarminglyCute } from "./187-tuk-tuk-disarmingly-cute";

describe("Tuk Tuk - Disarmingly Cute", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tukTukDisarminglyCute],
    });

    const cardUnderTest = testEngine.getCardModel(tukTukDisarminglyCute);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Resist 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tukTukDisarminglyCute],
    });

    const cardUnderTest = testEngine.getCardModel(tukTukDisarminglyCute);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tukTukDisarminglyCute } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Tuk Tuk - Disarmingly Cute", () => {
//   it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [tukTukDisarminglyCute],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(tukTukDisarminglyCute);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   it.skip("Resist +2 (Damage dealt to this character is reduced by 2.)", async () => {
//     const testEngine = new TestEngine({
//       play: [tukTukDisarminglyCute],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(tukTukDisarminglyCute);
//     expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
