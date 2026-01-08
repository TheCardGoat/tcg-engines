import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { sirHissAggravatingAsp } from "./086-sir-hiss-aggravating-asp";

describe("Sir Hiss - Aggravating Asp", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [sirHissAggravatingAsp],
    });

    const cardUnderTest = testEngine.getCardModel(sirHissAggravatingAsp);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { sirHissAggravatingAsp } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Sir Hiss - Aggravating Asp", () => {
//   it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     const testStore = new TestStore({
//       play: [sirHissAggravatingAsp],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       sirHissAggravatingAsp.id,
//     );
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
