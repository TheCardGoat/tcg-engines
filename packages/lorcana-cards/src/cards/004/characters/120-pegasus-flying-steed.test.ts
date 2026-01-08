import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { pegasusFlyingSteed } from "./120-pegasus-flying-steed";

describe("Pegasus - Flying Steed", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [pegasusFlyingSteed],
    });

    const cardUnderTest = testEngine.getCardModel(pegasusFlyingSteed);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { pegasusFlyingSteed } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Pegasus - Flying Steed", () => {
//   it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     const testStore = new TestStore({
//       play: [pegasusFlyingSteed],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       pegasusFlyingSteed.id,
//     );
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
