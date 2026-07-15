// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PinocchioStarAttraction,
//   PinocchioTalkativePuppet,
//   TheHuntsmanReluctantEnforcer,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { captainHookMasterSwordsman } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Captain Hook - Master Swordsman", () => {
//   It("**NEMESIS** During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [captainHookMasterSwordsman],
//       },
//       {
//         Play: [
//           TheHuntsmanReluctantEnforcer,
//           PinocchioTalkativePuppet,
//           PinocchioStarAttraction,
//         ],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CaptainHookMasterSwordsman.id,
//     );
//
//     Const target = testStore.getByZoneAndId(
//       "play",
//       TheHuntsmanReluctantEnforcer.id,
//       "player_two",
//     );
//     Const target2 = testStore.getByZoneAndId(
//       "play",
//       PinocchioTalkativePuppet.id,
//       "player_two",
//     );
//     Const target3 = testStore.getByZoneAndId(
//       "play",
//       PinocchioStarAttraction.id,
//       "player_two",
//     );
//
//     [target, target2, target3].forEach((char) => {
//       Char.updateCardMeta({ exerted: true });
//       CardUnderTest.challenge(char);
//
//       Expect(char.zone).toBe("discard");
//       Expect(cardUnderTest.ready).toBe(true);
//     });
//
//     Expect(cardUnderTest.hasQuestRestriction).toBe(true);
//   });
// });
//
