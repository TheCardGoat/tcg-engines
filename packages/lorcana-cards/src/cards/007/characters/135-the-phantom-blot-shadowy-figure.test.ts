import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { thePhantomBlotShadowyFigure } from "./135-the-phantom-blot-shadowy-figure";

describe("The Phantom Blot - Shadowy Figure", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thePhantomBlotShadowyFigure],
    });

    const cardUnderTest = testEngine.getCardModel(thePhantomBlotShadowyFigure);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { thePhantomBlotShadowyFigure } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Phantom Blot - Shadowy Figure", () => {
//   it.skip("Rush (This character can challenge the turn they're played.)", async () => {
//     const testEngine = new TestEngine({
//       play: [thePhantomBlotShadowyFigure],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(thePhantomBlotShadowyFigure);
//     expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
