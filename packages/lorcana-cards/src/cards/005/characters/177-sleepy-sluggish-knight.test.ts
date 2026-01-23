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
// import { describe, it } from "@jest/globals";
// import { sleepySluggishKnight } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Sleepy - Sluggish Knight", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: sleepySluggishKnight.cost,
//       play: [sleepySluggishKnight],
//     });
//
//     const cardUnderTest = testStore.getCard(sleepySluggishKnight);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
