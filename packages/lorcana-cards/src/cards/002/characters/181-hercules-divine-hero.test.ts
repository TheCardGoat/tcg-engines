import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { herculesDivineHero } from "./181-hercules-divine-hero";

describe("Hercules - Divine Hero", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesDivineHero],
    });

    const cardUnderTest = testEngine.getCardModel(herculesDivineHero);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Resist 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesDivineHero],
    });

    const cardUnderTest = testEngine.getCardModel(herculesDivineHero);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { herculesDivineHero } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Hercules- Divine Hero", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: herculesDivineHero.cost,
//
//       hand: [herculesDivineHero],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       herculesDivineHero.id,
//     );
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveTopOfStack({});
//   });
// });
//
