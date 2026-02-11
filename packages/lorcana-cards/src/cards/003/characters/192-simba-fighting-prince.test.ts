// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloGalacticHero,
//   LiloMakingAWish,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { simbaFightingPrince } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Simba - Fighting Prince", () => {
//   Describe("**SUBMIT OR FIGHT** When you play this character and whenever this character banishes another character in a challenge during your turn, choose one:· You may draw 2 cards, then choose and discard 2 cards.· You may deal 2 damage to chosen character.", () => {
//     It("On play", () => {
//       Const testStore = new TestStore({
//         Inkwell: simbaFightingPrince.cost,
//         Hand: [simbaFightingPrince, liloMakingAWish, liloGalacticHero],
//         Deck: 2,
//       });
//
//       Const cardUnderTest = testStore.getCard(simbaFightingPrince);
//       Const discardCard = testStore.getCard(liloGalacticHero);
//       Const discardAnotherCard = testStore.getCard(liloMakingAWish);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ mode: "1" }, true);
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({
//         Targets: [discardCard, discardAnotherCard],
//       });
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 2, deck: 0, play: 1, discard: 2 }),
//       );
//     });
//   });
// });
//
