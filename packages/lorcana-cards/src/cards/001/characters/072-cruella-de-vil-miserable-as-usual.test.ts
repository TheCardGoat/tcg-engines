import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { cruellaDeVilMiserableAsUsual } from "./072-cruella-de-vil-miserable-as-usual";

describe("Cruella De Vil - Miserable as Usual", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [cruellaDeVilMiserableAsUsual] });
  //   expect(testEngine.getCardModel(cruellaDeVilMiserableAsUsual).hasKeyword()).toBe(true);
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
//   cruellaDeVilMiserableAsUsual,
//   teKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Cruella De Vil - Miserable As Usual", () => {
//   describe("**You'll Be Sorry** When this character is challenged and banished, you may return chosen character to their player's hand.", () => {
//     it("should banish the challenging character", () => {
//       const testStore = new TestStore(
//         {
//           play: [teKaTheBurningOne],
//         },
//         {
//           play: [cruellaDeVilMiserableAsUsual],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         cruellaDeVilMiserableAsUsual.id,
//         "player_two",
//       );
//
//       const attacker = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       expect(cardUnderTest.zone).toEqual("play");
//       cardUnderTest.updateCardMeta({ exerted: true });
//
//       attacker.challenge(cardUnderTest);
//
//       testStore.changePlayer("player_two");
//
//       testStore.resolveOptionalAbility();
//       testStore.resolveTopOfStack({ targetId: attacker.instanceId });
//
//       expect(testStore.getZonesCardCount("player_two")).toEqual(
//         expect.objectContaining({ discard: 1, play: 0 }),
//       );
//       expect(testStore.getZonesCardCount("player_one")).toEqual(
//         expect.objectContaining({ hand: 1, play: 0 }),
//       );
//       expect(attacker.zone).toEqual("hand");
//       expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     it("skips banish effect", () => {
//       const testStore = new TestStore(
//         {
//           play: [teKaTheBurningOne],
//         },
//         {
//           play: [cruellaDeVilMiserableAsUsual],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         cruellaDeVilMiserableAsUsual.id,
//         "player_two",
//       );
//
//       const attacker = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       expect(cardUnderTest.zone).toEqual("play");
//       cardUnderTest.updateCardMeta({ exerted: true });
//
//       attacker.challenge(cardUnderTest);
//       testStore.changePlayer().resolveOptionalAbility();
//       testStore.resolveTopOfStack({ skip: true });
//
//       expect(testStore.getZonesCardCount("player_one")).toEqual(
//         expect.objectContaining({ discard: 0, play: 1 }),
//       );
//       expect(testStore.getZonesCardCount("player_two")).toEqual(
//         expect.objectContaining({ discard: 1, play: 0 }),
//       );
//       expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//   });
// });
//
