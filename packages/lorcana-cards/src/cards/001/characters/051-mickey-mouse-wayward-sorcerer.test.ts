import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { mickeyMouseWaywardSorcerer } from "./051-mickey-mouse-wayward-sorcerer";

describe("Mickey Mouse - Wayward Sorcerer", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [mickeyMouseWaywardSorcerer] });
  //   Expect(testEngine.getCardModel(mickeyMouseWaywardSorcerer).hasKeyword()).toBe(true);
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
//   LiloMakingAWish,
//   MagicBroomBucketBrigade,
//   MickeyMouseWaywardSorcerer,
//   SimbaProtectiveCub,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mickey Mouse - Wayward Sorcerer", () => {
//   Describe("**ANIMATE BROOM** You pay 1 {I} less to play Broom characters.", () => {
//     It("should reduce the cost of Broom characters by 1", () => {
//       Const testStore = new TestStore({
//         Inkwell: magicBroomBucketBrigade.cost - 1,
//         Play: [mickeyMouseWaywardSorcerer],
//         Hand: [magicBroomBucketBrigade],
//       });
//
//       Const target = testStore.getByZoneAndId(
//         "hand",
//         MagicBroomBucketBrigade.id,
//       );
//
//       Target.playFromHand();
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(target.zone).toEqual("play");
//     });
//
//     It("Two Mickeys should reduce the cost of Broom characters by 2", () => {
//       Const testStore = new TestStore({
//         Inkwell: magicBroomBucketBrigade.cost - 2,
//         Play: [mickeyMouseWaywardSorcerer, mickeyMouseWaywardSorcerer],
//         Hand: [magicBroomBucketBrigade],
//       });
//
//       Const target = testStore.getByZoneAndId(
//         "hand",
//         MagicBroomBucketBrigade.id,
//       );
//
//       Target.playFromHand();
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(target.zone).toEqual("play");
//     });
//   });
//
//   Describe("**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.", () => {
//     It("as attacker", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [mickeyMouseWaywardSorcerer, magicBroomBucketBrigade],
//         },
//         {
//           Play: [simbaProtectiveCub],
//         },
//       );
//
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         SimbaProtectiveCub.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         MagicBroomBucketBrigade.id,
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//       TestStore.resolveOptionalAbility();
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(attacker.zone).toEqual("hand");
//     });
//
//     It("as defender", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [simbaProtectiveCub],
//         },
//         {
//           Play: [mickeyMouseWaywardSorcerer, magicBroomBucketBrigade],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", simbaProtectiveCub.id);
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         MagicBroomBucketBrigade.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//       TestStore.changePlayer("player_two");
//       TestStore.resolveTopOfStack();
//
//       Expect(defender.zone).toEqual("hand");
//     });
//
//     It("opponent's brooms don't get affected by the ability", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [mickeyMouseWaywardSorcerer, simbaProtectiveCub],
//         },
//         {
//           Play: [magicBroomBucketBrigade],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", simbaProtectiveCub.id);
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         MagicBroomBucketBrigade.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//
//       Expect(defender.zone).toEqual("discard");
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It("non-brooms don't get affected by the skill", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [mickeyMouseWaywardSorcerer, liloMakingAWish],
//         },
//         {
//           Play: [simbaProtectiveCub],
//         },
//       );
//
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         SimbaProtectiveCub.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId("play", liloMakingAWish.id);
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//
//       Expect(attacker.zone).toEqual("discard");
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//   });
// });
//
