import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { beastThickskinned } from "./176-beast-thick-skinned";

describe("Beast - Thick-Skinned", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [beastThickskinned],
    });

    const cardUnderTest = testEngine.getCardModel(beastThickskinned);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { beastThickSkinned } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Beast - Thick-Skinned", () => {
//   it.skip("**Resist** +1 _(Damage dealt to this character is reduced by 1 )_", () => {
//     const testStore = new TestStore({
//       play: [beastThickSkinned],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       beastThickSkinned.id,
//     );
//     expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
