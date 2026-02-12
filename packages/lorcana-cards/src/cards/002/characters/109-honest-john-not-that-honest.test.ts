// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HerculesDivineHero,
//   HonestJohnNotThatHonest,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Honest John - Not That Honest", () => {
//   It("**EASY STREET** Whenever you play a Floodborn character, each opponent loses 1 lore.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: herculesDivineHero.cost,
//         Hand: [herculesDivineHero],
//         Play: [honestJohnNotThatHonest],
//       },
//       {
//         Lore: 3,
//       },
//     );
//
//     Const floodbornChar = testStore.getByZoneAndId(
//       "hand",
//       HerculesDivineHero.id,
//     );
//
//     Expect(testStore.getPlayerLore("player_two")).toEqual(3);
//     FloodbornChar.playFromHand();
//     Expect(testStore.getPlayerLore("player_two")).toEqual(2);
//   });
// });
//
