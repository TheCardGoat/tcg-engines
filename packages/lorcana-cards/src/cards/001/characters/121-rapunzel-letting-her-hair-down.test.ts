// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { rapunzelLettingHerHairDown } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rapunzel - Letting Down Her Hair", () => {
//   Describe("**TANGLE** When you play this character, each opponent loses 1 lore.", () => {
//     It("Opponent loses lore", () => {
//       Const testStore = new TestStore({
//         Inkwell: rapunzelLettingHerHairDown.cost,
//         Hand: [rapunzelLettingHerHairDown],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         RapunzelLettingHerHairDown.id,
//       );
//
//       TestStore.store.tableStore.getTable("player_two").lore = 5;
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
//     });
//   });
// });
//
