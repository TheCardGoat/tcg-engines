// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CamiloMadrigalFamilyCopycat,
//   ZazuAdvisorToMufasa,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Camilo Madrigal - Family Copycat", () => {
//   Describe("**IMITATE** Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.", () => {
//     It("should gain lore equal to the {L} of chosen other character of yours", () => {
//       Const testStore = new TestStore({
//         Play: [camiloMadrigalFamilyCopycat, zazuAdvisorToMufasa],
//       });
//
//       Const cardUnderTest = testStore.getCard(camiloMadrigalFamilyCopycat);
//       Const otherCharacter = testStore.getCard(zazuAdvisorToMufasa);
//
//       CardUnderTest.quest();
//
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [otherCharacter] });
//
//       Expect(testStore.getPlayerLore("player_one")).toBe(
//         ZazuAdvisorToMufasa.lore + camiloMadrigalFamilyCopycat.lore,
//       );
//       Expect(otherCharacter.zone).toBe("hand");
//     });
//
//     It("should NOT trigger if there's not another char", () => {
//       Const testStore = new TestStore({
//         Play: [camiloMadrigalFamilyCopycat],
//       });
//
//       Const cardUnderTest = testStore.getCard(camiloMadrigalFamilyCopycat);
//
//       CardUnderTest.quest();
//       Expect(testStore.stackLayers).toHaveLength(0);
//
//       Expect(testStore.getPlayerLore("player_one")).toBe(
//         CamiloMadrigalFamilyCopycat.lore,
//       );
//     });
//   });
// });
//
