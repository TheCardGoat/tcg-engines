import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { ursulaMadSeaWitch } from "./057-ursula-mad-sea-witch";

describe("Ursula - Mad Sea Witch", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ursulaMadSeaWitch],
    });

    const cardUnderTest = testEngine.getCardModel(ursulaMadSeaWitch);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { ursulaMadSeaWitch } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ursula - Mad Sea Witch", () => {
//   it.skip("**Challenger +2** _(While challenging, this character gets +2 {S}.)_", () => {
//     const testStore = new TestStore({
//       inkwell: ursulaMadSeaWitch.cost,
//       play: [ursulaMadSeaWitch],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ursulaMadSeaWitch.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
