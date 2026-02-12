// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { stichtNewDog } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { chernabogsFollowersCreaturesOfEvil } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { magicBroomIlluminaryKeeper } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { theLibraryAGiftForBelle } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Library - A Gift for Belle", () => {
//   Describe("**LOST IN A BOOK** Whenever a character is banished while here, you may draw a card.", () => {
//     It("Removal", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: theLibraryAGiftForBelle.moveCost + fireTheCannons.cost,
//         Hand: [fireTheCannons],
//         Play: [theLibraryAGiftForBelle, stichtNewDog],
//         Deck: 5,
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(theLibraryAGiftForBelle);
//       Const targetCard = testEngine.getCardModel(stichtNewDog);
//       Const removal = testEngine.getCardModel(fireTheCannons);
//
//       Expect(
//         TestEngine.store.effectStore.getTriggeredAbilitiesForCard(
//           TargetCard,
//           () => true,
//         ),
//       ).toHaveLength(0);
//       TargetCard.enterLocation(cardUnderTest);
//       Expect(
//         TestEngine.store.effectStore.getTriggeredAbilitiesForCard(
//           TargetCard,
//           () => true,
//         ),
//       ).toHaveLength(1);
//
//       Expect(targetCard.isAtLocation(cardUnderTest)).toBe(true);
//
//       Await testEngine.playCard(removal);
//       Await testEngine.resolveTopOfStack({ targets: [targetCard] }, true);
//
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(testEngine.getZonesCardCount().hand).toBe(1);
//       Expect(testEngine.getZonesCardCount().deck).toBe(4);
//     });
//
//     It("Chernabog's Followers", () => {
//       Const testStore = new TestStore({
//         Inkwell: theLibraryAGiftForBelle.moveCost,
//         Play: [theLibraryAGiftForBelle, chernabogsFollowersCreaturesOfEvil],
//         Deck: 5,
//       });
//
//       Const cardUnderTest = testStore.getCard(theLibraryAGiftForBelle);
//       Const targetCard = testStore.getCard(chernabogsFollowersCreaturesOfEvil);
//
//       TargetCard.enterLocation(cardUnderTest);
//       TargetCard.quest();
//       // Chernabo's Followers is banished and draws a card
//       TestStore.resolveOptionalAbility();
//
//       // Draws a card from Library's effect
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.getZonesCardCount().hand).toBe(2);
//       Expect(testStore.getZonesCardCount().deck).toBe(3);
//     });
//   });
//
//   It("Magic Broom - Illuminary Keeper", () => {
//     Const testStore = new TestStore({
//       Inkwell:
//         TheLibraryAGiftForBelle.moveCost +
//         ChernabogsFollowersCreaturesOfEvil.cost,
//       Play: [theLibraryAGiftForBelle, magicBroomIlluminaryKeeper],
//       Hand: [chernabogsFollowersCreaturesOfEvil],
//       Deck: 5,
//     });
//
//     Const cardUnderTest = testStore.getCard(theLibraryAGiftForBelle);
//     Const targetCard = testStore.getCard(magicBroomIlluminaryKeeper);
//
//     TargetCard.enterLocation(cardUnderTest);
//     TestStore.getCard(chernabogsFollowersCreaturesOfEvil).playFromHand();
//
//     // Magic Broom Illuminary Keeper is banished and draws a card
//     TestStore.resolveOptionalAbility();
//
//     // Draws a card from Library's effect
//     TestStore.resolveOptionalAbility();
//
//     Expect(testStore.getZonesCardCount().hand).toBe(2);
//     Expect(testStore.getZonesCardCount().deck).toBe(3);
//   });
// });
//
