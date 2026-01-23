// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   enchantressUnexpectedJudge,
//   goofyKnightForADay,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Enchantress - Unexpected Judge", () => {
//   it("**TRUE FORM** While being challenged, this character gets +2 {S}.", () => {
//     const testStore = new TestStore(
//       {
//         play: [goofyKnightForADay],
//       },
//       {
//         play: [enchantressUnexpectedJudge],
//       },
//     );
//
//     const challenger = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       enchantressUnexpectedJudge.id,
//       "player_two",
//     );
//     cardUnderTest.updateCardMeta({ exerted: true });
//
//     challenger.challenge(cardUnderTest);
//
//     expect(challenger.damage).toEqual(enchantressUnexpectedJudge.strength + 2);
//   });
// });
//
