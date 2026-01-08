// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   pinocchioStarAttraction,
//   pinocchioTalkativePuppet,
//   theHuntsmanReluctantEnforcer,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { captainHookMasterSwordsman } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Captain Hook - Master Swordsman", () => {
//   it("**NEMESIS** During your turn, whenever this character banishes another character in a challenge, ready this character. He can't quest for the rest of this turn.", () => {
//     const testStore = new TestStore(
//       {
//         play: [captainHookMasterSwordsman],
//       },
//       {
//         play: [
//           theHuntsmanReluctantEnforcer,
//           pinocchioTalkativePuppet,
//           pinocchioStarAttraction,
//         ],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       captainHookMasterSwordsman.id,
//     );
//
//     const target = testStore.getByZoneAndId(
//       "play",
//       theHuntsmanReluctantEnforcer.id,
//       "player_two",
//     );
//     const target2 = testStore.getByZoneAndId(
//       "play",
//       pinocchioTalkativePuppet.id,
//       "player_two",
//     );
//     const target3 = testStore.getByZoneAndId(
//       "play",
//       pinocchioStarAttraction.id,
//       "player_two",
//     );
//
//     [target, target2, target3].forEach((char) => {
//       char.updateCardMeta({ exerted: true });
//       cardUnderTest.challenge(char);
//
//       expect(char.zone).toBe("discard");
//       expect(cardUnderTest.ready).toBe(true);
//     });
//
//     expect(cardUnderTest.hasQuestRestriction).toBe(true);
//   });
// });
//
