// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { letItGo } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { grammaTalaSpiritOfTheOcean } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { aladdinBraveRescuer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { allFunnedOut } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import {
//   DonaldDuckFocusedFlatfoot,
//   TipoGrowingSon,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gramma Tala - Spirit of the Ocean", () => {
//   Describe("**DO YOU KNOW WHO YOU ARE?** Whenever a card is put into your inkwell, gain 1 lore.", () => {
//     It("Adding card from hand to inkwell should give +1 lore", () => {
//       Const testStore = new TestStore({
//         Play: [grammaTalaSpiritOfTheOcean],
//         Hand: [aladdinBraveRescuer, liloMakingAWish],
//       });
//
//       TestStore.store.tableStore.getTable("player_one").lore = 0;
//
//       Const cardToPutInInkwell = testStore.getCard(aladdinBraveRescuer);
//       CardToPutInInkwell.addToInkwell();
//
//       Expect(testStore.getPlayerLore()).toBe(1);
//     });
//
//     It("cards with effect that add to inkwell should also trigger ability", async () => {
//       Const testStore = new TestEngine({
//         Inkwell: 20,
//         Play: [grammaTalaSpiritOfTheOcean],
//         Hand: [
//           TipoGrowingSon,
//           LiloMakingAWish,
//           AllFunnedOut,
//           DonaldDuckFocusedFlatfoot,
//         ],
//         Deck: 1,
//       });
//
//       TestStore.store.tableStore.getTable("player_one").lore = 0;
//
//       Const tipoCard = testStore.getCardModel(tipoGrowingSon);
//       Const allFunnedOutCard = testStore.getCardModel(allFunnedOut);
//       Const donaldDuckCard = testStore.getCardModel(donaldDuckFocusedFlatfoot);
//       Const cardToPutInInkwell = testStore.getCardModel(liloMakingAWish);
//
//       Await testStore.playCard(tipoCard);
//       Await testStore.resolveOptionalAbility();
//       Await testStore.resolveTopOfStack({ targets: [cardToPutInInkwell] });
//
//       Expect(testStore.getPlayerLore()).toBe(1);
//
//       AllFunnedOutCard.playFromHand();
//       Await testStore.resolveTopOfStack({ targets: [tipoCard] });
//
//       Expect(testStore.getPlayerLore()).toBe(2);
//
//       Await testStore.playCard(donaldDuckCard);
//       Await testStore.resolveOptionalAbility();
//
//       Expect(testStore.getPlayerLore()).toBe(3);
//     });
//
//     It("should gain lore when opponent puts cards into your inkwell", async () => {
//       Const testStore = new TestEngine(
//         {
//           Inkwell: letItGo.cost,
//           Hand: [letItGo],
//           Lore: 0,
//         },
//         {
//           Play: [grammaTalaSpiritOfTheOcean, liloMakingAWish],
//           Lore: 0,
//         },
//       );
//
//       Const letItGoCard = testStore.getCardModel(letItGo);
//       Const cardToPutInInkwell = testStore.getCardModel(liloMakingAWish);
//       LetItGoCard.playFromHand();
//
//       Await testStore.resolveTopOfStack(
//         { targets: [cardToPutInInkwell] },
//         True,
//       );
//
//       Expect(testStore.getPlayerLore("player_two")).toBe(1);
//     });
//
//     It("should not gain lore when opponent puts gramma into your inkweel", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: letItGo.cost,
//           Hand: [letItGo],
//         },
//         {
//           Play: [grammaTalaSpiritOfTheOcean],
//         },
//       );
//
//       TestStore.store.tableStore.getTable("player_two").lore = 0;
//
//       Const letItGoCard = testStore.getCard(letItGo);
//       Const cardToPutInInkwell = testStore.getCard(grammaTalaSpiritOfTheOcean);
//       LetItGoCard.playFromHand();
//
//       TestStore.resolveTopOfStack({ targets: [cardToPutInInkwell] });
//
//       Expect(testStore.getPlayerLore("player_two")).toBe(0);
//     });
//   });
// });
//
