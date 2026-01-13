import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { liloJuniorCakeDecorator } from "./008-lilo-junior-cake-decorator";

describe("Lilo - Junior Cake Decorator", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [liloJuniorCakeDecorator],
    });

    const cardUnderTest = testEngine.getCardModel(liloJuniorCakeDecorator);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Lilo - Junior Cake Decorator", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: liloJuniorCakeDecorator.cost,
//       play: [liloJuniorCakeDecorator],
//     });
//
//     const cardUnderTest = testStore.getCard(liloJuniorCakeDecorator);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
