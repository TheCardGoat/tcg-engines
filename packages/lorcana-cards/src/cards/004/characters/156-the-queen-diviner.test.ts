// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloGalacticHero,
//   RapunzelGiftedWithHealing,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { bindingContract } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { theQueenDiviner } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { greatStoneDragon } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Queen - Diviner", () => {
//   Describe("**CONSULT THE GRIMOIRE** {E} – Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item card costs 3 or less, you may play that item for free and it enters play exerted. Put the rest on the bottom of your deck in any order.", () => {
//     It("should allow the player to play an item card for free if it costs 3 or less", () => {
//       Const testStore = new TestStore({
//         Play: [theQueenDiviner],
//         Deck: [
//           LiloGalacticHero,
//           GreatStoneDragon,
//           GoofyKnightForADay,
//           StichtNewDog,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getCard(theQueenDiviner);
//       Const target = testStore.getCard(greatStoneDragon);
//       Const otherCards = [
//         TestStore.getCard(liloGalacticHero),
//         TestStore.getCard(goofyKnightForADay),
//         TestStore.getCard(stichtNewDog),
//       ];
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack(
//         {
//           Scry: {
//             Bottom: otherCards,
//             Play: [target],
//           },
//         },
//         True,
//       );
//
//       OtherCards.forEach((card) => {
//         Expect(card.zone).toBe("deck");
//       });
//       Expect(target.zone).toBe("play");
//     });
//
//     It("should allow the player to put in hand an item card if it costs 3 or more", () => {
//       Const testStore = new TestStore({
//         Play: [theQueenDiviner],
//         Deck: [
//           LiloGalacticHero,
//           BindingContract,
//           GoofyKnightForADay,
//           StichtNewDog,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getCard(theQueenDiviner);
//       Const target = testStore.getCard(bindingContract);
//       Const otherCards = [
//         TestStore.getCard(liloGalacticHero),
//         TestStore.getCard(goofyKnightForADay),
//         TestStore.getCard(stichtNewDog),
//       ];
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack(
//         {
//           Scry: {
//             Bottom: otherCards,
//             Play: [target],
//           },
//         },
//         True,
//       );
//
//       OtherCards.forEach((card) => {
//         Expect(card.zone).toBe("deck");
//       });
//       Expect(target.zone).toBe("hand");
//     });
//
//     It("should put the rest of the cards to the bottom", () => {
//       Const testStore = new TestStore({
//         Play: [theQueenDiviner],
//         Deck: [
//           BindingContract,
//           LiloGalacticHero,
//           RapunzelGiftedWithHealing,
//           GoofyKnightForADay,
//           StichtNewDog,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getCard(theQueenDiviner);
//       Const remainingCardOnDeck = testStore.getCard(bindingContract);
//       Const bottomCards = [
//         TestStore.getCard(rapunzelGiftedWithHealing),
//         TestStore.getCard(liloGalacticHero),
//         TestStore.getCard(goofyKnightForADay),
//         TestStore.getCard(stichtNewDog),
//       ];
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack(
//         {
//           Scry: {
//             Bottom: bottomCards,
//           },
//         },
//         True,
//       );
//
//       Expect(remainingCardOnDeck.zone).toBe("deck");
//       TestStore.store.drawCard("player_one");
//       Expect(remainingCardOnDeck.zone).toBe("hand");
//     });
//   });
// });
//
