import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { ruttNorthernMoose } from "./004-rutt-northern-moose";

describe("Rutt - Northern Moose", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ruttNorthernMoose],
    });

    const cardUnderTest = testEngine.getCardModel(ruttNorthernMoose);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { ruttNorthernMoose } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Rutt - Northern Moose", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: ruttNorthernMoose.cost,
//       play: [ruttNorthernMoose],
//     });
//
//     const cardUnderTest = testStore.getCard(ruttNorthernMoose);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
