// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   EnchantressUnexpectedJudge,
//   GoofyKnightForADay,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Enchantress - Unexpected Judge", () => {
//   It("**TRUE FORM** While being challenged, this character gets +2 {S}.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [goofyKnightForADay],
//       },
//       {
//         Play: [enchantressUnexpectedJudge],
//       },
//     );
//
//     Const challenger = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       EnchantressUnexpectedJudge.id,
//       "player_two",
//     );
//     CardUnderTest.updateCardMeta({ exerted: true });
//
//     Challenger.challenge(cardUnderTest);
//
//     Expect(challenger.damage).toEqual(enchantressUnexpectedJudge.strength + 2);
//   });
// });
//
