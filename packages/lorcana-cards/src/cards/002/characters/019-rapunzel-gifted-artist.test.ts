// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   RapunzelGiftedArtist,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { maleficentMistressOfEvil } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rapunzel - Gifted Artist", () => {
//   It("**LET YOUR POWER SHINE** Whenever you remove 1 or more damage from one of your characters, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Play: [rapunzelGiftedArtist, goofyKnightForADay],
//       Deck: 5,
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       RapunzelGiftedArtist.id,
//     );
//     Const anotherCharacter = testStore.getByZoneAndId(
//       "play",
//       GoofyKnightForADay.id,
//     );
//
//     CardUnderTest.updateCardDamage(4);
//     AnotherCharacter.updateCardDamage(4);
//
//     CardUnderTest.updateCardDamage(2, "remove");
//     TestStore.resolveOptionalAbility();
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 4,
//         Hand: 1,
//       }),
//     );
//
//     AnotherCharacter.updateCardDamage(2, "remove");
//     TestStore.resolveOptionalAbility();
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 3,
//         Hand: 2,
//       }),
//     );
//   });
//
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [rapunzelGiftedArtist],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       RapunzelGiftedArtist.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toEqual(true);
//   });
// });
//
// Describe("Regression", () => {
//   It("Rapunzel, Maleficent COMBO WOMBO", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [rapunzelGiftedArtist, maleficentMistressOfEvil],
//         Deck: 20,
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Const target = testEngine.getCardModel(goofyKnightForADay);
//     Const rapunzel = await testEngine.setCardDamage(
//       RapunzelGiftedArtist,
//       RapunzelGiftedArtist.willpower - 1,
//     );
//     Const maleficent = await testEngine.setCardDamage(
//       MaleficentMistressOfEvil,
//       MaleficentMistressOfEvil.willpower - 1,
//     );
//
//     // Questing with Maleficent will draw you a card
//     Await testEngine.questCard(maleficent);
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ deck: 19, hand: 1 }),
//     );
//
//     // COMBO STARTS - Moving all damage from Maleficent to Goofy
//     For (let i = 2; i < 4; i++) {
//       // Drawing a card, will let you move damage
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [maleficent] }, true);
//       Await testEngine.resolveTopOfStack(
//         { targets: [goofyKnightForADay] },
//         True,
//       );
//       Expect(maleficent.damage).toEqual(maleficentMistressOfEvil.willpower - i);
//       Expect(target.damage).toEqual(i - 1);
//
//       // Moving damage will let you draw a card from Rapunzel
//       Await testEngine.resolveOptionalAbility();
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ deck: 20 - i, hand: i }),
//       );
//     }
//
//     // COMBO Continues - Moving all damage from Rapunzel to Goofy
//     For (let i = 2; i < 7; i++) {
//       // Drawing a card, will let you move damage
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [rapunzel] }, true);
//       Await testEngine.resolveTopOfStack(
//         { targets: [goofyKnightForADay] },
//         True,
//       );
//       Expect(rapunzel.damage).toEqual(rapunzel.willpower - i);
//       Expect(target.damage).toEqual(i + 1);
//
//       // Moving damage will let you draw a card from Rapunzel
//       Await testEngine.resolveOptionalAbility();
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ deck: 18 - i, hand: 2 + i }),
//       );
//     }
//
//     Const totalDamageMoved =
//       MaleficentMistressOfEvil.willpower -
//       1 +
//       RapunzelGiftedArtist.willpower -
//       1;
//     Expect(rapunzel.damage).toEqual(0);
//     Expect(maleficent.damage).toEqual(0);
//     Expect(target.damage).toEqual(totalDamageMoved);
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 20 - totalDamageMoved - 1,
//         Hand: totalDamageMoved + 1,
//       }),
//     );
//   });
// });
//
