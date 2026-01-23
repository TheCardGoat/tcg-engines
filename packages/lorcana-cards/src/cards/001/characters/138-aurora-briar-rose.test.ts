import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { auroraBriarRose } from "./138-aurora-briar-rose";

describe("Aurora - Briar Rose", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [auroraBriarRose] });
  //   expect(testEngine.getCardModel(auroraBriarRose).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// import { describe, expect, it } from "@jest/globals";
// import {
//   auroraBriarRose,
//   mickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Aurora Briar Rose!", () => {
//   it("DISARMING BEAUTY effect - Chosen characters gets -2 {S} this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: auroraBriarRose.cost,
//       hand: [auroraBriarRose],
//       play: [mickeyMouseTrueFriend],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", auroraBriarRose.id);
//     const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) - 2);
//   });
// });
//
