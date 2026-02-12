// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AWholeNewWorld,
//   HakunaMatata,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   PeteGamesReferee,
//   PrinceNaveenUkulelePlayer,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince Naveen - Ukulele Player", () => {
//   It("**IT’S BEAUTIFUL NO?** When you play this character, you may play a song with cost 6 or less for free.", () => {
//     Const testStore = new TestStore({
//       Inkwell: princeNaveenUkulelePlayer.cost,
//       Hand: [princeNaveenUkulelePlayer, hakunaMatata],
//       Deck: 2,
//     });
//
//     Const cardUnderTest = testStore.getCard(princeNaveenUkulelePlayer);
//     Const targetCard = testStore.getCard(hakunaMatata);
//
//     CardUnderTest.playFromHand();
//     Expect(testStore.stackLayers).toHaveLength(1);
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [targetCard] });
//     Expect(targetCard.zone).toBe("discard");
//   });
// });
//
// Describe("Regressions", () => {
//   It("Can't play if there's play restrictions", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: peteGamesReferee.cost,
//         Hand: [peteGamesReferee],
//         Deck: 1,
//       },
//       {
//         Inkwell: princeNaveenUkulelePlayer.cost,
//         Hand: [princeNaveenUkulelePlayer, aWholeNewWorld],
//         Deck: 2,
//       },
//     );
//
//     Const peteRestriction = testStore.getCard(peteGamesReferee);
//
//     PeteRestriction.playFromHand();
//     Expect(
//       TestStore.store.continuousEffectStore.continuousEffects,
//     ).toHaveLength(1);
//
//     TestStore.passTurn();
//
//     TestStore.changePlayer("player_two");
//     Const cardUnderTest = testStore.getCard(princeNaveenUkulelePlayer);
//     Const targetCard = testStore.getCard(aWholeNewWorld);
//
//     CardUnderTest.playFromHand();
//     Expect(
//       TestStore.store.continuousEffectStore.continuousEffects,
//     ).toHaveLength(1);
//     Expect(testStore.stackLayers).toHaveLength(1);
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [targetCard] });
//     Expect(targetCard.zone).toBe("hand");
//   });
// });
//
