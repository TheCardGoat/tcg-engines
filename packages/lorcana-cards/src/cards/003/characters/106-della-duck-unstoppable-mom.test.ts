import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { dellaDuckUnstoppableMom } from "./106-della-duck-unstoppable-mom";

describe("Della Duck - Unstoppable Mom", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [dellaDuckUnstoppableMom],
    });

    const cardUnderTest = testEngine.getCardModel(dellaDuckUnstoppableMom);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dellaDuckUnstoppableMom } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Della Duck - Unstoppable Mom", () => {
//   it.skip("**Reckless** _(This character can't quest and must challenge each turn if able.)_", () => {
//     const testStore = new TestStore({
//       play: [dellaDuckUnstoppableMom],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       dellaDuckUnstoppableMom.id,
//     );
//     expect(cardUnderTest.hasReckless).toBe(true);
//   });
// });
//
