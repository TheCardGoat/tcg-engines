import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { tukTukWreckingBall } from "./128-tuk-tuk-wrecking-ball";

describe("Tuk Tuk - Wrecking Ball", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tukTukWreckingBall],
    });

    const cardUnderTest = testEngine.getCardModel(tukTukWreckingBall);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { tukTukWreckingBall } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Tuk Tuk - Wrecking Ball", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: tukTukWreckingBall.cost,
//
//       play: [tukTukWreckingBall],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       tukTukWreckingBall.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
