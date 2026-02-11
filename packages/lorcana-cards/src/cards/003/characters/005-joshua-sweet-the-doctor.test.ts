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
// Import { describe, expect, it } from "@jest/globals";
// Import { joshuaSweetTheDoctor } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Joshua Sweet - The Doctor", () => {
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
//     Const testStore = new TestStore({
//       Play: [joshuaSweetTheDoctor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       JoshuaSweetTheDoctor.id,
//     );
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
