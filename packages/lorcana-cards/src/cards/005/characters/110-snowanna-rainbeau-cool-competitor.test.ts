import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { snowannaRainbeauCoolCompetitor } from "./110-snowanna-rainbeau-cool-competitor";

describe("Snowanna Rainbeau - Cool Competitor", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [snowannaRainbeauCoolCompetitor],
    });

    const cardUnderTest = testEngine.getCardModel(
      snowannaRainbeauCoolCompetitor,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { snowannaRainbeauCoolCompetitor } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Snowanna Rainbeau - Cool Competitor", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: snowannaRainbeauCoolCompetitor.cost,
//       play: [snowannaRainbeauCoolCompetitor],
//     });
//
//     const cardUnderTest = testStore.getCard(snowannaRainbeauCoolCompetitor);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
