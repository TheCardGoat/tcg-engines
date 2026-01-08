import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { iagoPrettyPolly } from "./040-iago-pretty-polly";

describe("Iago - Pretty Polly", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [iagoPrettyPolly],
    });

    const cardUnderTest = testEngine.getCardModel(iagoPrettyPolly);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { iagoPrettyPolly } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Iago - Pretty Polly", () => {
//   it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     const testStore = new TestStore({
//       play: [iagoPrettyPolly],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", iagoPrettyPolly.id);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
