import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { joshuaSweetTheDoctor } from "./005-joshua-sweet-the-doctor";

describe("Joshua Sweet - The Doctor", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [joshuaSweetTheDoctor],
    });

    const cardUnderTest = testEngine.getCardModel(joshuaSweetTheDoctor);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { joshuaSweetTheDoctor } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Joshua Sweet - The Doctor", () => {
//   it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
//     const testStore = new TestStore({
//       play: [joshuaSweetTheDoctor],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       joshuaSweetTheDoctor.id,
//     );
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
