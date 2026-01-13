import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { dukeWeaseltonSmalltimeCrook } from "./146-duke-weaselton-small-time-crook";

describe("Duke Weaselton - Small-Time Crook", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [dukeWeaseltonSmalltimeCrook],
    });

    const cardUnderTest = testEngine.getCardModel(dukeWeaseltonSmalltimeCrook);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { dukeWeaseltonSmallTimeCrook } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Duke Weaselton - Small-Time Crook", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: dukeWeaseltonSmallTimeCrook.cost,
//
//       play: [dukeWeaseltonSmallTimeCrook],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       dukeWeaseltonSmallTimeCrook.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
