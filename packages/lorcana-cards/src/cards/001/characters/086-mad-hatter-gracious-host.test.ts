import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { madHatterGraciousHost } from "./086-mad-hatter-gracious-host";

describe("Mad Hatter - Gracious Host", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [madHatterGraciousHost] });
  //   Expect(testEngine.getCardModel(madHatterGraciousHost).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "bun:test";
// Import {
//   MadHatterGraciousHost,
//   MagicBroomBucketBrigade,
//   MauriceWorldFamousInventor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mad Hatter - Gracious Host", () => {
//   It("**TEA PARTY** Whenever this character is challenged, you may draw a card.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [mauriceWorldFamousInventor],
//       },
//       {
//         Deck: [magicBroomBucketBrigade],
//         Play: [madHatterGraciousHost],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MadHatterGraciousHost.id,
//       "player_two",
//     );
//
//     Const attacker = testStore.getByZoneAndId(
//       "play",
//       MauriceWorldFamousInventor.id,
//     );
//
//     CardUnderTest.updateCardMeta({ exerted: true });
//     Attacker.challenge(cardUnderTest);
//
//     TestStore.changePlayer().resolveTopOfStack();
//
//     Expect(testStore.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ hand: 0, deck: 0 }),
//     );
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0 }),
//     );
//   });
// });
//
