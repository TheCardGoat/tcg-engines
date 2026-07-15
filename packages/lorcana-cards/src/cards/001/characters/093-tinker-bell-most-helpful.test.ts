import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { tinkerBellMostHelpful } from "./093-tinker-bell-most-helpful";

describe("Tinker Bell - Most Helpful", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [tinkerBellMostHelpful] });
  //   Expect(testEngine.getCardModel(tinkerBellMostHelpful).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JohnSilverAlienPirate,
//   TinkerBellMostHelpful,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tinker Bell - Most Helpful", () => {
//   It("**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: tinkerBellMostHelpful.cost,
//       Hand: [tinkerBellMostHelpful],
//       Play: [johnSilverAlienPirate],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       TinkerBellMostHelpful.id,
//     );
//
//     Const target = testStore.getByZoneAndId("play", johnSilverAlienPirate.id);
//
//     Expect(target.hasEvasive).toBeFalsy();
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//     Expect(target.hasEvasive).toBeTruthy();
//   });
// });
//
