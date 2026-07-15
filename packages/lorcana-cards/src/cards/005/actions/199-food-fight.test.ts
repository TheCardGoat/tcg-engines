// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { foodFight } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { taffytaMuttonfudgeRuthlessRival } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Food Fight!", () => {
//   It("Your characters gain {E}, 1 {I} – Deal 1 damage to chosen character this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: foodFight.cost,
//         Hand: [foodFight],
//         Play: [taffytaMuttonfudgeRuthlessRival],
//       },
//       {
//         Deck: 1,
//       },
//     );
//
//     Const target = testStore.getCard(taffytaMuttonfudgeRuthlessRival);
//     Const cardUnderTest = testStore.getCard(foodFight);
//
//     Expect(target.activatedAbilities).toHaveLength(0);
//     CardUnderTest.playFromHand();
//     Expect(target.activatedAbilities).toHaveLength(1);
//     TestStore.passTurn();
//     Expect(target.activatedAbilities).toHaveLength(0);
//   });
// });
//
