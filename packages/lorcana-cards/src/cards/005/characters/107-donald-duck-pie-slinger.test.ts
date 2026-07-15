// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { donaldDuck } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { donaldDuckPieSlinger } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Donald Duck - Pie Slinger", () => {
//   It("**HUMBLE PIE** When you play this character, if you used **Shift** to play him, each opponent loses 2 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: donaldDuckPieSlinger.cost,
//       Hand: [donaldDuckPieSlinger],
//       Play: [donaldDuck],
//     });
//
//     TestStore.store.tableStore.getTable("player_two").updateLore(5);
//
//     Const cardUnderTest = testStore.getCard(donaldDuckPieSlinger);
//     Const target = testStore.getCard(donaldDuck);
//
//     CardUnderTest.shift(target);
//
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(3);
//   });
//
//   It("**RAGING DUCK** While an opponent has 10 or more lore, this character gets +6 {S}.", () => {
//     Const testStore = new TestStore({
//       Play: [donaldDuckPieSlinger],
//     });
//
//     Const cardUnderTest = testStore.getCard(donaldDuckPieSlinger);
//
//     Expect(cardUnderTest.strength).toBe(donaldDuckPieSlinger.strength);
//
//     TestStore.store.tableStore.getTable("player_two").updateLore(10);
//
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(10);
//     Expect(cardUnderTest.strength).toBe(donaldDuckPieSlinger.strength + 6);
//   });
// });
//
