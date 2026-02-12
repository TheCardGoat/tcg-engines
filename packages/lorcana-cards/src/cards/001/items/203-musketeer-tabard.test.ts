import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { musketeerTabard } from "./203-musketeer-tabard";

describe("Musketeer Tabard - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [musketeerTabard] });
  //   Expect(testEngine.getCardModel(musketeerTabard).hasKeyword()).toBe(true);
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
//   HerculesTrueHero,
//   LiloMakingAWish,
//   SimbaProtectiveCub,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { musketeerTabard } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Musketeer Tabard", () => {
//   Describe("**ALL FOR ONE AND ONE FOR ALL** Whenever one of your characters with **Bodyguard** is banished, you may draw a card.", () => {
//     It("Triggers when your bodyguard's die", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 2,
//           Play: [musketeerTabard, simbaProtectiveCub, herculesTrueHero],
//         },
//         {
//           Play: [teKaTheBurningOne],
//         },
//       );
//
//       Const musketeerOne = testStore.getByZoneAndId(
//         "play",
//         SimbaProtectiveCub.id,
//       );
//       Const musketeerTwo = testStore.getByZoneAndId(
//         "play",
//         HerculesTrueHero.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         TeKaTheBurningOne.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       MusketeerOne.challenge(defender);
//       TestStore.resolveTopOfStack();
//       Expect(musketeerOne.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().deck).toBe(1);
//
//       MusketeerTwo.challenge(defender);
//       TestStore.resolveTopOfStack();
//       Expect(musketeerTwo.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().deck).toBe(0);
//     });
//
//     It("Non bodyguard don't trigger the effect", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 2,
//           Play: [musketeerTabard, liloMakingAWish],
//         },
//         {
//           Play: [teKaTheBurningOne],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", liloMakingAWish.id);
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         TeKaTheBurningOne.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       Expect(attacker.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().deck).toBe(2);
//     });
//
//     It("Opponent's musketeers don't trigger the effect", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 2,
//           Play: [musketeerTabard, teKaTheBurningOne],
//         },
//         {
//           Play: [simbaProtectiveCub, herculesTrueHero],
//         },
//       );
//
//       Const bodyguardOne = testStore.getByZoneAndId(
//         "play",
//         SimbaProtectiveCub.id,
//         "player_two",
//       );
//       Const bodyguardTwo = testStore.getByZoneAndId(
//         "play",
//         HerculesTrueHero.id,
//         "player_two",
//       );
//       Const defender = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       Defender.updateCardMeta({ exerted: true });
//
//       BodyguardOne.challenge(defender);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       Expect(bodyguardOne.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().deck).toBe(2);
//
//       BodyguardTwo.challenge(defender);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       Expect(bodyguardTwo.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().deck).toBe(2);
//     });
//   });
// });
//
