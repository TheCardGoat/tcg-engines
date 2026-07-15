// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   GrandPabbieOldestAndWisest,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Grand Pabbie - Oldest and Wisest", () => {
//   It("**ANCIENT INSIGHT** Whenever you remove 1 or more damage from one of your characters, gain 2 lore.", () => {
//     Const testStore = new TestStore({
//       Play: [grandPabbieOldestAndWisest, goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       GrandPabbieOldestAndWisest.id,
//     );
//     Const anotherCharacter = testStore.getByZoneAndId(
//       "play",
//       GoofyKnightForADay.id,
//     );
//     CardUnderTest.updateCardDamage(4);
//     AnotherCharacter.updateCardDamage(4);
//
//     Expect(testStore.getPlayerLore()).toEqual(0);
//
//     CardUnderTest.updateCardDamage(2, "remove");
//     Expect(testStore.getPlayerLore()).toEqual(2);
//
//     AnotherCharacter.updateCardDamage(2, "remove");
//     Expect(testStore.getPlayerLore()).toEqual(4);
//   });
// });
//
