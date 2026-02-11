import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { sleepySluggishKnight } from "./177-sleepy-sluggish-knight";

describe("Sleepy - Sluggish Knight", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [sleepySluggishKnight],
    });

    const cardUnderTest = testEngine.getCardModel(sleepySluggishKnight);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { sleepySluggishKnight } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sleepy - Sluggish Knight", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: sleepySluggishKnight.cost,
//       Play: [sleepySluggishKnight],
//     });
//
//     Const cardUnderTest = testStore.getCard(sleepySluggishKnight);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
