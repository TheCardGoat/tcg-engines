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
// Import { describe, expect, it } from "@jest/globals";
// Import { princeEricSeafaringPrince } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince Eric - Seafaring Prince", () => {
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)_", () => {
//     Const testStore = new TestStore({
//       Play: [princeEricSeafaringPrince],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PrinceEricSeafaringPrince.id,
//     );
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
