import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { cruellaDeVilMiserableAsUsual } from "./072-cruella-de-vil-miserable-as-usual";

describe("Cruella De Vil - Miserable as Usual", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [cruellaDeVilMiserableAsUsual] });
  //   Expect(testEngine.getCardModel(cruellaDeVilMiserableAsUsual).hasKeyword()).toBe(true);
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
//   CruellaDeVilMiserableAsUsual,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cruella De Vil - Miserable As Usual", () => {
//   Describe("**You'll Be Sorry** When this character is challenged and banished, you may return chosen character to their player's hand.", () => {
//     It("should banish the challenging character", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [teKaTheBurningOne],
//         },
//         {
//           Play: [cruellaDeVilMiserableAsUsual],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         CruellaDeVilMiserableAsUsual.id,
//         "player_two",
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//
//       TestStore.changePlayer("player_two");
//
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targetId: attacker.instanceId });
//
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ discard: 1, play: 0 }),
//       );
//       Expect(testStore.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({ hand: 1, play: 0 }),
//       );
//       Expect(attacker.zone).toEqual("hand");
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It("skips banish effect", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [teKaTheBurningOne],
//         },
//         {
//           Play: [cruellaDeVilMiserableAsUsual],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         CruellaDeVilMiserableAsUsual.id,
//         "player_two",
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//       TestStore.changePlayer().resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(testStore.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({ discard: 0, play: 1 }),
//       );
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ discard: 1, play: 0 }),
//       );
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//   });
// });
//
