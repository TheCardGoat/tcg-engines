// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { annaTrueHearted } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { minnieMouseQuickthinkingInventor } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Anna - True-Hearted", () => {
//   It("**LET ME HELP YOU** Whenever this character quests, your other Hero characters get +1 {L} this turn.", () => {
//     Const testStore = new TestStore({
//       Play: [
//         AnnaTrueHearted,
//         MinnieMouseQuickthinkingInventor,
//         MrSmeeBumblingMate,
//       ],
//     });
//
//     // Fetch the cards in play
//     Const cardUnderTest = testStore.getByZoneAndId("play", annaTrueHearted.id);
//     Const target1 = testStore.getByZoneAndId(
//       "play",
//       MinnieMouseQuickthinkingInventor.id,
//     );
//     Const target2 = testStore.getByZoneAndId("play", mrSmeeBumblingMate.id);
//
//     // Quest with Anna
//     CardUnderTest.quest();
//
//     // Check if the other Hero characters have +1 lore and non-hero characters are unchanged
//     Expect(target1.lore).toEqual(2);
//     Expect(target2.lore).toEqual(2);
//
//     // Quest with the other heroes
//     Target1.quest();
//     Target2.quest();
//
//     // Check to see if the lore total has increased by the expected amount
//     Expect(testStore.getPlayerLore()).toEqual(6);
//
//     // Pass the turn
//     Const response = testStore.passTurn();
//     Expect(response.success).toBeTruthy();
//
//     // Check to see if the lore of the other Hero characters has decreased by the expected amount
//     Expect(target1.lore).toEqual(1);
//     Expect(target2.lore).toEqual(2);
//   });
// });
//
