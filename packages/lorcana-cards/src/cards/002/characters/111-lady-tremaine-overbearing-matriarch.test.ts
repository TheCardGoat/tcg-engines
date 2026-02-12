// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ladyTremaineOverbearingMatriarch } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lady Tremaine - Overbearing Matriarch", () => {
//   It("**NOT FOR YOU** When you play this character, each opponent with more lore than you loses 1 lore.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: ladyTremaineOverbearingMatriarch.cost,
//         Hand: [ladyTremaineOverbearingMatriarch],
//         Lore: 1,
//       },
//       {
//         Lore: 3,
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       LadyTremaineOverbearingMatriarch.id,
//     );
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.getPlayerLore("player_two")).toEqual(2);
//   });
// });
//
