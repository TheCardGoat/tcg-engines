import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { shantiVillageGirl } from "./013-shanti-village-girl";

describe("Shanti - Village Girl", () => {
  it("should have Singer 5 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [shantiVillageGirl],
    });

    const cardUnderTest = testEngine.getCardModel(shantiVillageGirl);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { shantiVillageGirl } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Shanti - Village Girl", () => {
//   it.skip("Singer 5 (This character counts as cost 5 to sing songs.)", async () => {
//     const testEngine = new TestEngine({
//       play: [shantiVillageGirl],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(shantiVillageGirl);
//     expect(cardUnderTest.hasSinger).toBe(true);
//   });
// });
//
