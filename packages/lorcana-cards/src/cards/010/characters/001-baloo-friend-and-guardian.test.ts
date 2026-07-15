import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { balooFriendAndGuardian } from "./001-baloo-friend-and-guardian";

describe("Baloo - Friend and Guardian", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [balooFriendAndGuardian],
    });

    const cardUnderTest = testEngine.getCardModel(balooFriendAndGuardian);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [balooFriendAndGuardian],
    });

    const cardUnderTest = testEngine.getCardModel(balooFriendAndGuardian);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { balooFriendAndGuardian } from "@lorcanito/lorcana-engine/cards/010/characters/001-baloo-friend-and-guardian";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Baloo - Friend and Guardian", () => {
//   It("should have Bodyguard ability", () => {
//     Const testEngine = new TestEngine({
//       Play: [balooFriendAndGuardian],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(balooFriendAndGuardian);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It("should have Support ability", () => {
//     Const testEngine = new TestEngine({
//       Play: [balooFriendAndGuardian],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(balooFriendAndGuardian);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
// });
//
