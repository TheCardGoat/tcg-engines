import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { tongSurvivor } from "./126-tong-survivor";

describe("Tong - Survivor", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tongSurvivor],
    });

    const cardUnderTest = testEngine.getCardModel(tongSurvivor);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tongSurvivor } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Tong - Survivor", () => {
//   it.skip("**Reckless** _(This character can't quest and must challenge each turn if able.)_", () => {
//     const testStore = new TestStore({
//       play: [tongSurvivor],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", tongSurvivor.id);
//     expect(cardUnderTest.hasReckless).toBe(true);
//   });
// });
//
