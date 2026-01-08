import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { kuzcoTemperamentalEmperor } from "./084-kuzco-temperamental-emperor";

describe("Kuzco - Temperamental Emperor", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [kuzcoTemperamentalEmperor] });
  //   expect(testEngine.getCardModel(kuzcoTemperamentalEmperor).hasKeyword()).toBe(true);
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
//   kuzcoTemperamentalEmperor,
//   teKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Kuzco - Temperamental Emperor", () => {
//   describe("NO TOUCHY!** When this character is challenged and banished, you may banish the challenging character.", () => {
//     it.skip("should banish the challenging character", () => {
//       const testStore = new TestStore(
//         {
//           play: [teKaTheBurningOne],
//         },
//         {
//           play: [kuzcoTemperamentalEmperor],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         kuzcoTemperamentalEmperor.id,
//         "player_two",
//       );
//
//       const attacker = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       expect(cardUnderTest.zone).toEqual("play");
//       cardUnderTest.updateCardMeta({ exerted: true });
//
//       attacker.challenge(cardUnderTest);
//       testStore.resolveTopOfStack();
//
//       expect(testStore.getZonesCardCount("player_one")).toEqual(
//         expect.objectContaining({ discard: 1, play: 0 }),
//       );
//       expect(testStore.getZonesCardCount("player_two")).toEqual(
//         expect.objectContaining({ discard: 1, play: 0 }),
//       );
//     });
//
//     it.skip("skips banish effect", () => {
//       const testStore = new TestStore(
//         {
//           play: [teKaTheBurningOne],
//         },
//         {
//           play: [kuzcoTemperamentalEmperor],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         kuzcoTemperamentalEmperor.id,
//         "player_two",
//       );
//
//       const attacker = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       expect(cardUnderTest.zone).toEqual("play");
//       cardUnderTest.updateCardMeta({ exerted: true });
//
//       attacker.challenge(cardUnderTest);
//       testStore.resolveTopOfStack();
//
//       expect(testStore.getZonesCardCount("player_one")).toEqual(
//         expect.objectContaining({ discard: 0, play: 1 }),
//       );
//       expect(testStore.getZonesCardCount("player_two")).toEqual(
//         expect.objectContaining({ discard: 1, play: 0 }),
//       );
//     });
//   });
// });
//
