import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { ursulaVanessa } from "./022-ursula-vanessa";

describe("Ursula - Vanessa", () => {
  it("should have Singer 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ursulaVanessa],
    });

    const cardUnderTest = testEngine.getCardModel(ursulaVanessa);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { ursulaVanessa } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ursula - Vanessa", () => {
//   it.skip("**Singer** 4 _(This character counts as cost 4 to sing songs.)_", async () => {
//     const testEngine = new TestEngine({
//       play: [ursulaVanessa],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(ursulaVanessa);
//     expect(cardUnderTest.hasSinger).toBe(true);
//   });
// });
//
