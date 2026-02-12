import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { kuzcoTemperamentalEmperor } from "./084-kuzco-temperamental-emperor";

describe("Kuzco - Temperamental Emperor", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [kuzcoTemperamentalEmperor] });
  //   Expect(testEngine.getCardModel(kuzcoTemperamentalEmperor).hasKeyword()).toBe(true);
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
//   KuzcoTemperamentalEmperor,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Kuzco - Temperamental Emperor", () => {
//   Describe("NO TOUCHY!** When this character is challenged and banished, you may banish the challenging character.", () => {
//     It.skip("should banish the challenging character", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [teKaTheBurningOne],
//         },
//         {
//           Play: [kuzcoTemperamentalEmperor],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         KuzcoTemperamentalEmperor.id,
//         "player_two",
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//       TestStore.resolveTopOfStack();
//
//       Expect(testStore.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({ discard: 1, play: 0 }),
//       );
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ discard: 1, play: 0 }),
//       );
//     });
//
//     It.skip("skips banish effect", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [teKaTheBurningOne],
//         },
//         {
//           Play: [kuzcoTemperamentalEmperor],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         KuzcoTemperamentalEmperor.id,
//         "player_two",
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//       TestStore.resolveTopOfStack();
//
//       Expect(testStore.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({ discard: 0, play: 1 }),
//       );
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ discard: 1, play: 0 }),
//       );
//     });
//   });
// });
//
