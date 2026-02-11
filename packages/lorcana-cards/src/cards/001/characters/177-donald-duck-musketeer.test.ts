import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { donaldDuckMusketeer } from "./177-donald-duck-musketeer";

describe("Donald Duck - Musketeer", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [donaldDuckMusketeer] });
  //   Expect(testEngine.getCardModel(donaldDuckMusketeer).hasKeyword()).toBe(true);
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
// Describe("Donald Duck - Musketeer", () => {
//   Describe("**STAY ALERT!** During your turn, your Musketeer characters gain **Evasive.** _(They can challenge characters with Evasive.)_", () => {
//     It("during your turn, Musketeer characters gain **Evasive.**", () => {
//       Const testStore = new TestStore({
//         Play: [mickeyMouseMusketeer, donaldDuckMusketeer, goofyMusketeer],
//       });
//
//       Const target = testStore.getByZoneAndId("play", mickeyMouseMusketeer.id);
//       Const anotherTarget = testStore.getByZoneAndId("play", goofyMusketeer.id);
//
//       Expect(target.hasEvasive).toEqual(true);
//       Expect(anotherTarget.hasEvasive).toEqual(true);
//     });
//
//     It("during OPPONENT's turn, Musketeer characters DON'T gain **Evasive.**", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [mickeyMouseMusketeer, donaldDuckMusketeer, goofyMusketeer],
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       Const target = testStore.getByZoneAndId("play", mickeyMouseMusketeer.id);
//       Const anotherTarget = testStore.getByZoneAndId("play", goofyMusketeer.id);
//
//       TestStore.store.passTurn("player_one");
//
//       Expect(target.hasEvasive).toEqual(false);
//       Expect(anotherTarget.hasEvasive).toEqual(false);
//     });
//
//     It("Non-musketeers don't get the bonus", () => {
//       Const testStore = new TestStore({
//         Play: [lefouBumbler, jumbaJokibaaRenegadeScientist],
//       });
//
//       Const target = testStore.getByZoneAndId("play", lefouBumbler.id);
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         JumbaJokibaaRenegadeScientist.id,
//       );
//
//       Expect(target.hasEvasive).toEqual(false);
//       Expect(anotherTarget.hasEvasive).toEqual(false);
//     });
//   });
//
//   It("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
//     Const testStore = new TestStore({
//       Play: [donaldDuckMusketeer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DonaldDuckMusketeer.id,
//     );
//
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
