import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { sisuInHerElement } from "./039-sisu-in-her-element";

describe("Sisu - In Her Element", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [sisuInHerElement],
    });

    const cardUnderTest = testEngine.getCardModel(sisuInHerElement);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { sisuInHerElement } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Sisu - In Her Element", () => {
//   it.skip("**Challenger +2** _(While challenging, this character gets +2 {S}.)_", () => {
//     const testStore = new TestStore({
//       inkwell: sisuInHerElement.cost,
//       play: [sisuInHerElement],
//     });
//
//     const cardUnderTest = testStore.getCard(sisuInHerElement);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
