import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { chienpoImperialSoldier } from "./178-chien-po-imperial-soldier";

describe("Chien-Po - Imperial Soldier", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [chienpoImperialSoldier],
    });

    const cardUnderTest = testEngine.getCardModel(chienpoImperialSoldier);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { chienPoImperialSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Chien-Po - Imperial Soldier", () => {
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must chose one with Bodyguard if able.)_", () => {
//     Const testStore = new TestStore({
//       Play: [chienPoImperialSoldier],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ChienPoImperialSoldier.id,
//     );
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
