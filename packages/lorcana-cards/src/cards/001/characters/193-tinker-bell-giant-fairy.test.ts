import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { tinkerBellGiantFairy } from "./193-tinker-bell-giant-fairy";

describe("Tinker Bell - Giant Fairy", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [tinkerBellGiantFairy] });
  //   Expect(testEngine.getCardModel(tinkerBellGiantFairy).hasKeyword()).toBe(true);
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
//   HeiheiBoatSnack,
//   LiloMakingAWish,
//   TeKaHeartless,
//   TinkerBellGiantFairy,
//   TinkerBellTinyTactician,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tinker Bell - Giant Fairy", () => {
//   Describe("**PUNY PIRATE!** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.", () => {
//     It("should deal two damage", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [tinkerBellGiantFairy],
//         },
//         {
//           Play: [heiheiBoatSnack, teKaHeartless],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         TinkerBellGiantFairy.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         HeiheiBoatSnack.id,
//         "player_two",
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         TeKaHeartless.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//       Attacker.challenge(defender);
//       Expect(defender.isDead).toBeTruthy();
//
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//       Expect(target.meta.damage).toEqual(2);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It("skips effect", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [tinkerBellGiantFairy],
//         },
//         {
//           Play: [heiheiBoatSnack, teKaHeartless],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         TinkerBellGiantFairy.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         HeiheiBoatSnack.id,
//         "player_two",
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         TeKaHeartless.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(target.meta.damage).toBeFalsy();
//       Expect(defender.isDead).toBeTruthy();
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//   });
//
//   Describe("**ROCK THE BOAT** When you play this character, deal 1 damage to each opposing character.", () => {
//     It("Playing from hand", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: tinkerBellGiantFairy.cost,
//           Hand: [tinkerBellGiantFairy],
//         },
//         {
//           Play: [heiheiBoatSnack, teKaHeartless],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         TinkerBellGiantFairy.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         TeKaHeartless.id,
//         "player_two",
//       );
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         HeiheiBoatSnack.id,
//         "player_two",
//       );
//
//       CardUnderTest.playFromHand();
//
//       Expect(target.meta.damage).toEqual(1);
//       Expect(anotherTarget.meta.damage).toEqual(1);
//     });
//
//     It("Shifting", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: tinkerBellGiantFairy.cost,
//           Hand: [tinkerBellGiantFairy],
//           Play: [tinkerBellTinyTactician],
//         },
//         {
//           Play: [heiheiBoatSnack, teKaHeartless],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         TinkerBellGiantFairy.id,
//       );
//       Const shifted = testStore.getByZoneAndId(
//         "play",
//         TinkerBellTinyTactician.id,
//       );
//
//       Const target = testStore.getByZoneAndId(
//         "play",
//         TeKaHeartless.id,
//         "player_two",
//       );
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         HeiheiBoatSnack.id,
//         "player_two",
//       );
//
//       TestStore.store.shiftCard(cardUnderTest.instanceId, shifted.instanceId);
//
//       Expect(target.meta.damage).toEqual(1);
//       Expect(anotherTarget.meta.damage).toEqual(1);
//     });
//   });
// });
//
// Describe("Regression tests", () => {
//   It("Causing additional damage when banishing by her effect", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [tinkerBellGiantFairy],
//       },
//       {
//         Play: [heiheiBoatSnack, teKaHeartless, liloMakingAWish],
//       },
//     );
//
//     Const attacker = testEngine.getCardModel(tinkerBellGiantFairy);
//     Const defender = testEngine.getCardModel(heiheiBoatSnack);
//     Const target = testEngine.getCardModel(liloMakingAWish);
//
//     Defender.updateCardMeta({ exerted: true });
//
//     Attacker.challenge(defender);
//     Expect(defender.isDead).toBeTruthy();
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//     Expect(target.isDead).toBeTruthy();
//
//     Expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
