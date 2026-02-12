import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { mickeyMouseMusketeer } from "./186-mickey-mouse-musketeer";

describe("Mickey Mouse - Musketeer", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [mickeyMouseMusketeer] });
  //   Expect(testEngine.getCardModel(mickeyMouseMusketeer).hasKeyword()).toBe(true);
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
//   DonaldDuckMusketeer,
//   GoofyMusketeer,
//   JumbaJokibaaRenegadeScientist,
//   LefouBumbler,
//   MickeyMouseMusketeer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mickey Mouse - Musketeer", () => {
//   Describe("**ALL FOR ONE** Your other Musketeer characters get +1 {S}.", () => {
//     It("Your other Musketeer characters get +1 {S}.", () => {
//       Const testStore = new TestStore({
//         Play: [mickeyMouseMusketeer, donaldDuckMusketeer, goofyMusketeer],
//       });
//
//       Const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);
//       Const anotherTarget = testStore.getByZoneAndId("play", goofyMusketeer.id);
//
//       Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 1);
//       Expect(anotherTarget.strength).toEqual(
//         (anotherTarget.lorcanitoCard.strength || 0) + 1,
//       );
//     });
//
//     It("Mickey and non-musketeers don't get the bonus", () => {
//       Const testStore = new TestStore({
//         Play: [
//           MickeyMouseMusketeer,
//           LefouBumbler,
//           JumbaJokibaaRenegadeScientist,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseMusketeer.id,
//       );
//       Const target = testStore.getByZoneAndId("play", lefouBumbler.id);
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         JumbaJokibaaRenegadeScientist.id,
//       );
//
//       Expect(cardUnderTest.strength).toEqual(cardUnderTest.strength);
//       Expect(target.strength).toEqual(target.lorcanitoCard.strength);
//       Expect(anotherTarget.strength).toEqual(
//         AnotherTarget.lorcanitoCard.strength,
//       );
//     });
//   });
//
//   It("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
//     Const testStore = new TestStore({
//       Play: [mickeyMouseMusketeer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MickeyMouseMusketeer.id,
//     );
//
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
