// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { calhounMarineSergeant } from "@lorcanito/lorcana-engine/cards/006";
// Import { mushuMajesticDragon } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mushu - Majestic Dragon", () => {
//   It("INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge. (Damage dealt to them is reduced by 2.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [mushuMajesticDragon, mrSmeeBumblingMate],
//       },
//       {
//         Play: [calhounMarineSergeant],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(mrSmeeBumblingMate);
//     Const target = testEngine.getCardModel(calhounMarineSergeant);
//
//     Target.updateCardMeta({ exerted: true });
//     CardUnderTest.challenge(target);
//
//     Expect(testEngine.getCardZone(cardUnderTest)).toBe("play");
//     Expect(testEngine.getCardZone(target)).toBe("discard");
//     Expect(cardUnderTest.meta.damage).toBe(1);
//     Expect(cardUnderTest.hasResist).toBe(false); // Once challenge ends, resist is removed
//   });
//
//   It("GUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [mushuMajesticDragon, mrSmeeBumblingMate],
//       },
//       {
//         Play: [calhounMarineSergeant],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(mrSmeeBumblingMate);
//     Const target = testEngine.getCardModel(calhounMarineSergeant);
//
//     Target.updateCardMeta({ exerted: true });
//
//     Expect(testEngine.getPlayerLore()).toBe(0);
//     CardUnderTest.challenge(target);
//     Expect(testEngine.getPlayerLore()).toBe(2);
//   });
//
//   It("Ensure lore is only gained during players turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [mushuMajesticDragon, mrSmeeBumblingMate],
//       },
//       {
//         Play: [calhounMarineSergeant],
//       },
//     );
//
//     Const defender = testEngine.getCardModel(mrSmeeBumblingMate);
//     Const attacker = testEngine.getCardModel(calhounMarineSergeant);
//
//     Defender.updateCardMeta({ exerted: true });
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(mrSmeeBumblingMate).damage).toBe(1);
//
//     Expect(testEngine.getPlayerLore()).toBe(0);
//     Attacker.challenge(defender);
//     Expect(testEngine.getPlayerLore()).toBe(0);
//   });
// });
//
