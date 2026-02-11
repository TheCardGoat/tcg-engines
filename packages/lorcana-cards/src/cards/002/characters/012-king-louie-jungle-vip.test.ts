// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloGalacticHero,
//   LiloMakingAWish,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { kingLouieJungleVip } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("King Louie - Jungle VIP", () => {
//   It("**LAY IT ON THE LINE** Whenever another character is banished, you may remove up to 2 damage from this character.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [kingLouieJungleVip, liloGalacticHero, liloMakingAWish],
//       },
//       {
//         Play: [stichtNewDog],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       KingLouieJungleVip.id,
//     );
//     Const targetOne = testStore.getByZoneAndId("play", liloGalacticHero.id);
//     Const targetTwo = testStore.getByZoneAndId("play", liloMakingAWish.id);
//     Const targetThree = testStore.getByZoneAndId(
//       "play",
//       StichtNewDog.id,
//       "player_two",
//     );
//
//     CardUnderTest.updateCardDamage(5);
//
//     TargetOne.banish();
//     Expect(cardUnderTest.damage).toBe(5 - 2);
//
//     TargetTwo.banish();
//     Expect(cardUnderTest.damage).toBe(5 - 4);
//
//     TargetThree.banish();
//     Expect(cardUnderTest.damage).toBe(0);
//   });
// });
//
