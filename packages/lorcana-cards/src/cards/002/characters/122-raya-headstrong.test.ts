// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PinocchioStarAttraction,
//   PinocchioTalkativePuppet,
//   RayaHeadstrong,
//   TheHuntsmanReluctantEnforcer,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Raya - Headstrong", () => {
//   It("**NOTE TO SELF, DON’T DIE** During your turn, whenever this character banishes another character in a challenge, you may ready this character. She can’t quest for the rest of this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [rayaHeadstrong],
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
//     Const cardUnderTest = testStore.getByZoneAndId("play", rayaHeadstrong.id);
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
//
//     [target, target2].forEach((char) => {
//       Char.updateCardMeta({ exerted: true });
//       CardUnderTest.challenge(char);
//
//       Expect(char.zone).toBe("discard");
//       Expect(cardUnderTest.ready).toBe(true);
//     });
//
//     Expect(cardUnderTest.hasQuestRestriction).toBe(true);
//     Expect(cardUnderTest.damage).toBe(target.strength + target2.strength);
//   });
// });
//
