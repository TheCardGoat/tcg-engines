import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { tinkerBellMostHelpful } from "./093-tinker-bell-most-helpful";

describe("Tinker Bell - Most Helpful", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [tinkerBellMostHelpful] });
  //   expect(testEngine.getCardModel(tinkerBellMostHelpful).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   johnSilverAlienPirate,
//   tinkerBellMostHelpful,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Tinker Bell - Most Helpful", () => {
//   it("**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: tinkerBellMostHelpful.cost,
//       hand: [tinkerBellMostHelpful],
//       play: [johnSilverAlienPirate],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       tinkerBellMostHelpful.id,
//     );
//
//     const target = testStore.getByZoneAndId("play", johnSilverAlienPirate.id);
//
//     expect(target.hasEvasive).toBeFalsy();
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targetId: target.instanceId });
//     expect(target.hasEvasive).toBeTruthy();
//   });
// });
//
