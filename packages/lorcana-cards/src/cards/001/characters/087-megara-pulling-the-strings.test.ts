import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { megaraPullingTheStrings } from "./087-megara-pulling-the-strings";

describe("Megara - Pulling the Strings", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [megaraPullingTheStrings] });
  //   Expect(testEngine.getCardModel(megaraPullingTheStrings).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MegaraPullingTheStrings,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Megara Pulling the Strings", () => {
//   It("**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: megaraPullingTheStrings.cost,
//       Hand: [megaraPullingTheStrings],
//       Play: [mickeyMouseTrueFriend],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MegaraPullingTheStrings.id,
//     );
//     Const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 2);
//   });
// });
//
