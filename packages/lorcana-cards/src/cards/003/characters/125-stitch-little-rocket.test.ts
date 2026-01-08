import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { stitchLittleRocket } from "./125-stitch-little-rocket";

describe("Stitch - Little Rocket", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [stitchLittleRocket],
    });

    const cardUnderTest = testEngine.getCardModel(stitchLittleRocket);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { stitchLittleRocket } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Stitch - Little Rocket", () => {
//   it.skip("**Rush** _(This character can challenge the turn they’re played.)_", () => {
//     const testStore = new TestStore({
//       play: [stitchLittleRocket],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       stitchLittleRocket.id,
//     );
//     expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
