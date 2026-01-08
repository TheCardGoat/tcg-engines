import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { wendyDarlingAuthorityOnPeterPan } from "./158-wendy-darling-authority-on-peter-pan";

describe("Wendy Darling - Authority on Peter Pan", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [wendyDarlingAuthorityOnPeterPan],
    });

    const cardUnderTest = testEngine.getCardModel(
      wendyDarlingAuthorityOnPeterPan,
    );
    expect(cardUnderTest.hasWard()).toBe(true);
  });

  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [wendyDarlingAuthorityOnPeterPan],
    });

    const cardUnderTest = testEngine.getCardModel(
      wendyDarlingAuthorityOnPeterPan,
    );
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { wendyDarlingAuthorityOnPeterPan } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Wendy Darling - Authority on Peter Pan", () => {
//   it("**Ward** _(Opponents can't choose this character except to challenge.)", () => {
//     const testStore = new TestStore({
//       inkwell: wendyDarlingAuthorityOnPeterPan.cost,
//       play: [wendyDarlingAuthorityOnPeterPan],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       wendyDarlingAuthorityOnPeterPan.id,
//     );
//
//     expect(cardUnderTest.hasWard).toBe(true);
//   });
//
//   it("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
//     const testStore = new TestStore({
//       inkwell: wendyDarlingAuthorityOnPeterPan.cost,
//       play: [wendyDarlingAuthorityOnPeterPan],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       wendyDarlingAuthorityOnPeterPan.id,
//     );
//
//     expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
