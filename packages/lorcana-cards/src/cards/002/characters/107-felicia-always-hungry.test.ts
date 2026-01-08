import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { feliciaAlwaysHungry } from "./107-felicia-always-hungry";

describe("Felicia - Always Hungry", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [feliciaAlwaysHungry],
    });

    const cardUnderTest = testEngine.getCardModel(feliciaAlwaysHungry);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { feliciaAlwaysHungry } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Felicia - Always Hungry", () => {
//   it("Reckless", () => {
//     const testStore = new TestStore({
//       play: [feliciaAlwaysHungry],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       feliciaAlwaysHungry.id,
//     );
//
//     expect(cardUnderTest.hasReckless).toBe(true);
//   });
// });
//
