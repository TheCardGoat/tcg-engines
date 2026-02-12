import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { captainHookThinkingAHappyThought } from "./175-captain-hook-thinking-a-happy-thought";

describe("Captain Hook - Thinking a Happy Thought", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [captainHookThinkingAHappyThought] });
  //   Expect(testEngine.getCardModel(captainHookThinkingAHappyThought).hasKeyword()).toBe(true);
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
//   CaptainHookForcefulDuelist,
//   CaptainHookThinkingAHappyThought,
//   HansSchemingPrince,
//   MaleficentSorceress,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Captain Hook - Thinking a Happy Thought", () => {
//   Describe("**STOLEN DUST** Characters with cost 3 or less can't challenge this character.", () => {
//     It("Characters with cost 3 or less can't challenge THIS character.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [maleficentSorceress],
//         },
//         {
//           Play: [captainHookThinkingAHappyThought],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         CaptainHookThinkingAHappyThought.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId("play", maleficentSorceress.id);
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(cardUnderTest.meta.damage).toBeFalsy();
//
//       Expect(attacker.zone).toEqual("play");
//       Expect(attacker.meta.damage).toBeFalsy();
//       Expect(attacker.lorcanitoCard.cost).toEqual(3);
//     });
//
//     It("Characters with cost 3 or less can challenge OTHER character.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [maleficentSorceress],
//         },
//         {
//           Play: [captainHookThinkingAHappyThought, moanaOfMotunui],
//         },
//       );
//
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         MoanaOfMotunui.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId("play", maleficentSorceress.id);
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//
//       Expect(defender.zone).toEqual("play");
//       Expect(defender.meta.damage).toBeTruthy();
//
//       Expect(attacker.zone).toEqual("play");
//       Expect(attacker.meta.damage).toBeTruthy();
//       Expect(attacker.lorcanitoCard.cost).toEqual(3);
//     });
//
//     It("Characters with cost 4 or more can challenge this character.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [hansSchemingPrince],
//         },
//         {
//           Play: [captainHookThinkingAHappyThought],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         CaptainHookThinkingAHappyThought.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId("play", hansSchemingPrince.id);
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(cardUnderTest.meta.damage).toBeTruthy();
//
//       Expect(attacker.zone).toEqual("play");
//       Expect(attacker.meta.damage).toBeTruthy();
//       Expect(attacker.lorcanitoCard.cost).toEqual(4);
//     });
//   });
//
//   It("**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: 3,
//       Hand: [captainHookThinkingAHappyThought],
//       Play: [captainHookForcefulDuelist],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       CaptainHookThinkingAHappyThought.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       CaptainHookForcefulDuelist.id,
//     );
//
//     TestStore.store.shiftCard(cardUnderTest.instanceId, target.instanceId);
//
//     Expect(cardUnderTest.zone).toEqual("play");
//     Expect(cardUnderTest.meta.shifted).toEqual(target.instanceId);
//     Expect(target.meta.shifter).toEqual(cardUnderTest.instanceId);
//     Expect(
//       TestStore.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toEqual(0);
//   });
//
//   It("**Challenger** +3 _(While challenging, this character gets +3 {S}.)_", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [captainHookThinkingAHappyThought],
//       },
//       {
//         Play: [moanaOfMotunui],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CaptainHookThinkingAHappyThought.id,
//     );
//     Const defender = testStore.getByZoneAndId(
//       "play",
//       MoanaOfMotunui.id,
//       "player_two",
//     );
//
//     Defender.updateCardMeta({ exerted: true });
//
//     CardUnderTest.challenge(defender);
//
//     Expect(defender.meta.damage).toEqual(
//       (cardUnderTest.lorcanitoCard.strength || 0) + 3,
//     );
//     Expect(cardUnderTest.hasChallenger).toEqual(true);
//   });
// });
//
