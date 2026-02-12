import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { kidaRoyalWarrior } from "./177-kida-royal-warrior";

describe("Kida - Royal Warrior", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kidaRoyalWarrior],
    });

    const cardUnderTest = testEngine.getCardModel(kidaRoyalWarrior);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { kidaRoyalWarrior } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Kida - Royal Warrior", () => {
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
//     Const testStore = new TestStore({
//       Play: [kidaRoyalWarrior],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", kidaRoyalWarrior.id);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
