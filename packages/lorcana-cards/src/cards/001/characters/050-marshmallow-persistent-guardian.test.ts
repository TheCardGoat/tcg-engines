import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { marshmallowPersistentGuardian } from "./050-marshmallow-persistent-guardian";

describe("Marshmallow - Persistent Guardian", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [marshmallowPersistentGuardian] });
  //   Expect(testEngine.getCardModel(marshmallowPersistentGuardian).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   MarshmallowPersistentGuardian,
//   MauiDemiGod,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Marshmallow - Persistent Guardian", () => {
//   Describe("**DURABLE** When this character is banished in a challenge, you may return this card to your hand.", () => {
//     It("should not return to hand when banished out of a challenge", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: dragonFire.cost,
//           Hand: [dragonFire],
//         },
//         {
//           Play: [marshmallowPersistentGuardian],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         MarshmallowPersistentGuardian.id,
//         "player_two",
//       );
//       Const removal = testStore.getByZoneAndId("hand", dragonFire.id);
//
//       Removal.playFromHand();
//       TestStore.resolveTopOfStack({ targetId: cardUnderTest.instanceId });
//
//       Expect(cardUnderTest.zone).toEqual("discard");
//     });
//
//     It("as an attacker, should return to hand when banished", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [marshmallowPersistentGuardian],
//         },
//         {
//           Play: [mauiDemiGod],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         MarshmallowPersistentGuardian.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         MauiDemiGod.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//       CardUnderTest.challenge(defender);
//       TestStore.resolveTopOfStack();
//
//       Expect(cardUnderTest.zone).toEqual("hand");
//       Expect(defender.meta.damage).toEqual(
//         CardUnderTest.lorcanitoCard.strength,
//       );
//     });
//
//     It("as a defender, should return to hand when banished", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [mauiDemiGod],
//         },
//         {
//           Play: [marshmallowPersistentGuardian],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         MarshmallowPersistentGuardian.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId("play", mauiDemiGod.id);
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//       TestStore.changePlayer("player_two");
//       TestStore.resolveTopOfStack();
//
//       Expect(cardUnderTest.zone).toEqual("hand");
//       Expect(attacker.meta.damage).toEqual(
//         CardUnderTest.lorcanitoCard.strength,
//       );
//     });
//   });
// });
//
