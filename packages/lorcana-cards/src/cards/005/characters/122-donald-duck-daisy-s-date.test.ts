// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuckDaisysDate,
//   MonstroWhaleOfAWhale,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Donald Duck - Daisy's Date", () => {
//   It("**PLUCKY PLAY** Whenever this character challenges another character, each opponent loses 1 lore.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: donaldDuckDaisysDate.cost,
//         Play: [donaldDuckDaisysDate],
//       },
//       {
//         Play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     TestStore.store.tableStore.getTable("player_two").lore = 5;
//
//     Const cardUnderTest = testStore.getCard(donaldDuckDaisysDate);
//     Const defender = testStore.getCard(monstroWhaleOfAWhale);
//
//     Defender.updateCardMeta({ exerted: true });
//
//     CardUnderTest.challenge(defender);
//
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
//   });
// });
//
