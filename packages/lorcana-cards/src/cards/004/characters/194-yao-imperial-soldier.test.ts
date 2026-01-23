import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { yaoImperialSoldier } from "./194-yao-imperial-soldier";

describe("Yao - Imperial Soldier", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [yaoImperialSoldier],
    });

    const cardUnderTest = testEngine.getCardModel(yaoImperialSoldier);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { yaoImperialSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Yao - Imperial Soldier", () => {
//   it.skip("**Challenger +2** _(While challenging, this character gets +2 {S}.)_", () => {
//     const testStore = new TestStore({
//       inkwell: yaoImperialSoldier.cost,
//       play: [yaoImperialSoldier],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       yaoImperialSoldier.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
