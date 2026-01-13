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
// import { describe, expect, it } from "@jest/globals";
// import { chienPoImperialSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Chien-Po - Imperial Soldier", () => {
//   it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must chose one with Bodyguard if able.)_", () => {
//     const testStore = new TestStore({
//       play: [chienPoImperialSoldier],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       chienPoImperialSoldier.id,
//     );
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
