import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { mulanSoldierInTraining } from "./117-mulan-soldier-in-training";

describe("Mulan - Soldier in Training", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mulanSoldierInTraining],
    });

    const cardUnderTest = testEngine.getCardModel(mulanSoldierInTraining);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { mulanSoldierInTraining } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mulan - Soldier in Training", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: mulanSoldierInTraining.cost,
//
//       play: [mulanSoldierInTraining],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       mulanSoldierInTraining.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
