import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { lenaSabrewingRebelliousTeenager } from "./043-lena-sabrewing-rebellious-teenager";

describe("Lena Sabrewing - Rebellious Teenager", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [lenaSabrewingRebelliousTeenager],
    });

    const cardUnderTest = testEngine.getCardModel(
      lenaSabrewingRebelliousTeenager,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { lenaSabrewingRebelliousTeenager } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Lena Sabrewing - Rebellious Teenager", () => {
//   it.skip("**Rush** _(This character can challenge the turn they're played.)_", () => {
//     const testStore = new TestStore({
//       play: [lenaSabrewingRebelliousTeenager],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       lenaSabrewingRebelliousTeenager.id,
//     );
//     expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
