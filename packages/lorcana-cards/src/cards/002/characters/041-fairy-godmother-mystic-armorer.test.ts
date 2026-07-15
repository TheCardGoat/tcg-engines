// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   FairyGodmotherMysticArmorer,
//   PinocchioOnTheRun,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fairy Godmother - Mystic Armorer", () => {
//   It("shift", () => {
//     Const testStore = new TestStore({
//       Play: [fairyGodmotherMysticArmorer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       FairyGodmotherMysticArmorer.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toEqual(true);
//   });
//
//   Describe("**FORGET THE COACH, HERE'S A SWORD** Whenever this character quests, your characters gain **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn.", () => {
//     It("Your characters gain Challenger +3", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [
//             FairyGodmotherMysticArmorer,
//             LiloMakingAWish,
//             PinocchioOnTheRun,
//           ],
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         FairyGodmotherMysticArmorer.id,
//       );
//       Const target = testStore.getByZoneAndId("play", liloMakingAWish.id);
//       Const target2 = testStore.getByZoneAndId("play", pinocchioOnTheRun.id);
//
//       [target, target2].forEach((target) => {
//         Expect(target.hasChallenger).toEqual(false);
//       });
//       CardUnderTest.quest();
//       [target, target2].forEach((target) => {
//         Expect(target.hasChallenger).toEqual(true);
//       });
//       TestStore.passTurn();
//       [target, target2].forEach((target) => {
//         Expect(target.hasChallenger).toEqual(false);
//       });
//     });
//
//     It("your characters gain When this character is banished in a challenge, return this card to your hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [fairyGodmotherMysticArmorer, liloMakingAWish],
//         },
//         {
//           Play: [pinocchioOnTheRun],
//         },
//       );
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         FairyGodmotherMysticArmorer.id,
//       );
//       Const attacker = testStore.getByZoneAndId("play", liloMakingAWish.id);
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         PinocchioOnTheRun.id,
//         "player_two",
//       );
//
//       CardUnderTest.quest();
//
//       Defender.updateCardMeta({ exerted: true });
//       Attacker.challenge(defender);
//
//       Expect(attacker.zone).toEqual("hand");
//     });
//   });
// });
//
