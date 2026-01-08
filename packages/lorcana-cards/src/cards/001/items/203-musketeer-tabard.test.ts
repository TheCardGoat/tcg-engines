import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { musketeerTabard } from "./203-musketeer-tabard";

describe("Musketeer Tabard - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [musketeerTabard] });
  //   expect(testEngine.getCardModel(musketeerTabard).hasKeyword()).toBe(true);
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
//   herculesTrueHero,
//   liloMakingAWish,
//   simbaProtectiveCub,
//   teKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { musketeerTabard } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Musketeer Tabard", () => {
//   describe("**ALL FOR ONE AND ONE FOR ALL** Whenever one of your characters with **Bodyguard** is banished, you may draw a card.", () => {
//     it("Triggers when your bodyguard's die", () => {
//       const testStore = new TestStore(
//         {
//           deck: 2,
//           play: [musketeerTabard, simbaProtectiveCub, herculesTrueHero],
//         },
//         {
//           play: [teKaTheBurningOne],
//         },
//       );
//
//       const musketeerOne = testStore.getByZoneAndId(
//         "play",
//         simbaProtectiveCub.id,
//       );
//       const musketeerTwo = testStore.getByZoneAndId(
//         "play",
//         herculesTrueHero.id,
//       );
//       const defender = testStore.getByZoneAndId(
//         "play",
//         teKaTheBurningOne.id,
//         "player_two",
//       );
//
//       defender.updateCardMeta({ exerted: true });
//
//       musketeerOne.challenge(defender);
//       testStore.resolveTopOfStack();
//       expect(musketeerOne.zone).toEqual("discard");
//       expect(testStore.getZonesCardCount().deck).toBe(1);
//
//       musketeerTwo.challenge(defender);
//       testStore.resolveTopOfStack();
//       expect(musketeerTwo.zone).toEqual("discard");
//       expect(testStore.getZonesCardCount().deck).toBe(0);
//     });
//
//     it("Non bodyguard don't trigger the effect", () => {
//       const testStore = new TestStore(
//         {
//           deck: 2,
//           play: [musketeerTabard, liloMakingAWish],
//         },
//         {
//           play: [teKaTheBurningOne],
//         },
//       );
//
//       const attacker = testStore.getByZoneAndId("play", liloMakingAWish.id);
//       const defender = testStore.getByZoneAndId(
//         "play",
//         teKaTheBurningOne.id,
//         "player_two",
//       );
//
//       defender.updateCardMeta({ exerted: true });
//
//       attacker.challenge(defender);
//       expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       expect(attacker.zone).toEqual("discard");
//       expect(testStore.getZonesCardCount().deck).toBe(2);
//     });
//
//     it("Opponent's musketeers don't trigger the effect", () => {
//       const testStore = new TestStore(
//         {
//           deck: 2,
//           play: [musketeerTabard, teKaTheBurningOne],
//         },
//         {
//           play: [simbaProtectiveCub, herculesTrueHero],
//         },
//       );
//
//       const bodyguardOne = testStore.getByZoneAndId(
//         "play",
//         simbaProtectiveCub.id,
//         "player_two",
//       );
//       const bodyguardTwo = testStore.getByZoneAndId(
//         "play",
//         herculesTrueHero.id,
//         "player_two",
//       );
//       const defender = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       defender.updateCardMeta({ exerted: true });
//
//       bodyguardOne.challenge(defender);
//       expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       expect(bodyguardOne.zone).toEqual("discard");
//       expect(testStore.getZonesCardCount().deck).toBe(2);
//
//       bodyguardTwo.challenge(defender);
//       expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       expect(bodyguardTwo.zone).toEqual("discard");
//       expect(testStore.getZonesCardCount().deck).toBe(2);
//     });
//   });
// });
//
