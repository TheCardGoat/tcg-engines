import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { auroraBriarRose } from "./138-aurora-briar-rose";

describe("Aurora - Briar Rose", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [auroraBriarRose] });
  //   Expect(testEngine.getCardModel(auroraBriarRose).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AuroraBriarRose,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Aurora Briar Rose!", () => {
//   It("DISARMING BEAUTY effect - Chosen characters gets -2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: auroraBriarRose.cost,
//       Hand: [auroraBriarRose],
//       Play: [mickeyMouseTrueFriend],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", auroraBriarRose.id);
//     Const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) - 2);
//   });
// });
//
