// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { madamMimElephant } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Madam Mim - Elephant", () => {
//   It.skip("**A LITTLE GAME** When you play this character, banish her or return another chosen character of yours to your hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: madamMimElephant.cost,
//       Hand: [madamMimElephant],
//     });
//
//     Const cardUnderTest = testStore.getCard(madamMimElephant);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   Describe("**SNEAKY MOVE** At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.", () => {
//     It("Moves 1 damage counters from Madam Mim to Lilo", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [liloGalacticHero],
//         },
//         {
//           Play: [madamMimElephant],
//           Deck: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(madamMimElephant);
//       Const targetCard = testStore.getCard(liloGalacticHero);
//       CardUnderTest.updateCardDamage(1);
//
//       TestStore.passTurn();
//
//       TestStore.changePlayer("player_two");
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [targetCard] });
//
//       Expect(cardUnderTest.damage).toBe(0);
//       Expect(targetCard.damage).toBe(1);
//     });
//   });
// });
//
// Describe("Regression test", () => {
//   It("Doesn't trigger effect when there's no card to move damage to", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [madamMimElephant],
//         Deck: 2,
//       },
//       {
//         Deck: 2,
//       },
//     );
//
//     TestStore.passTurn();
//     TestStore.passTurn();
//
//     Expect(testStore.stackLayers).toHaveLength(0);
//   });
//
//   It("Doesn't trigger effect when there's no damage", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [madamMimElephant],
//         Deck: 2,
//       },
//       {
//         Deck: 2,
//         Play: [liloGalacticHero],
//       },
//     );
//
//     TestStore.passTurn();
//     TestStore.passTurn();
//
//     Expect(testStore.stackLayers).toHaveLength(0);
//   });
// });
//
