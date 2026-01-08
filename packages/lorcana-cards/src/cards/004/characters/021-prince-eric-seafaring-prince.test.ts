import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { princeEricSeafaringPrince } from "./021-prince-eric-seafaring-prince";

describe("Prince Eric - Seafaring Prince", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [princeEricSeafaringPrince],
    });

    const cardUnderTest = testEngine.getCardModel(princeEricSeafaringPrince);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { princeEricSeafaringPrince } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Prince Eric - Seafaring Prince", () => {
//   it.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)_", () => {
//     const testStore = new TestStore({
//       play: [princeEricSeafaringPrince],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       princeEricSeafaringPrince.id,
//     );
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
