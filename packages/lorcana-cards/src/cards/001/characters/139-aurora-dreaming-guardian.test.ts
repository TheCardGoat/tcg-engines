import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { auroraDreamingGuardian } from "./139-aurora-dreaming-guardian";

describe("Aurora - Dreaming Guardian", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [auroraDreamingGuardian] });
  //   Expect(testEngine.getCardModel(auroraDreamingGuardian).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AuroraDreamingGuardian,
//   MegaraPullingTheStrings,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Aurora - Dreaming Guardian", () => {
//   Describe("**Protective Embrace** Your other characters gain **Ward**. _(Opponents can't choose them except to challenge.)_", () => {
//     It("Other characters gain ward", () => {
//       Const testStore = new TestStore({
//         Play: [
//           MegaraPullingTheStrings,
//           MickeyMouseTrueFriend,
//           AuroraDreamingGuardian,
//         ],
//       });
//
//       Const target = testStore.getByZoneAndId(
//         "play",
//         MegaraPullingTheStrings.id,
//       );
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//       );
//
//       Expect(target.hasWard).toEqual(true);
//       Expect(anotherTarget.hasWard).toEqual(true);
//     });
//
//     It("Aurora herself doesn't have ward", () => {
//       Const testStore = new TestStore({
//         Play: [auroraDreamingGuardian],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         AuroraDreamingGuardian.id,
//       );
//
//       Expect(cardUnderTest.hasWard).toEqual(false);
//     });
//
//     It("Two Auroras give ward to one another", () => {
//       Const testStore = new TestStore({
//         Play: [auroraDreamingGuardian, auroraDreamingGuardian],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         AuroraDreamingGuardian.id,
//       );
//
//       Expect(cardUnderTest.hasWard).toEqual(true);
//     });
//   });
// });
//
