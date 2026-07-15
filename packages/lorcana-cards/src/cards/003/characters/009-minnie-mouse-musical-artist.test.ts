// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { minnieMouseMusicalArtist } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   DonaldDuckMusketeerSoldier,
//   GoofyMusketeerSwordsman,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Minnie Mouse - Musical Artist", () => {
//   It("**Singer** 3 _(This character counts as cost 3 to sing songs.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 2,
//       Hand: [friendsOnTheOtherSide],
//       Play: [minnieMouseMusicalArtist],
//       Deck: [mickeyBraveLittleTailor, mickeyBraveLittleTailor],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(minnieMouseMusicalArtist);
//     Const song = testEngine.getCardModel(friendsOnTheOtherSide);
//
//     Expect(cardUnderTest.hasSinger).toBe(true);
//
//     CardUnderTest.sing(song);
//
//     Expect(testEngine.getCardZone(song)).toBe("discard");
//   });
//
//   It("**ENTOURAGE** Whenever you play a character with **Bodyguard**, you may remove up to 2 damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: goofyMusketeerSwordsman.cost,
//       Play: [minnieMouseMusicalArtist, mickeyBraveLittleTailor],
//       Hand: [donaldDuckMusketeerSoldier],
//     });
//
//     Const target = testEngine.getCardModel(mickeyBraveLittleTailor);
//
//     Await testEngine.setCardDamage(target, 3);
//
//     Await testEngine.playCard(donaldDuckMusketeerSoldier, { bodyguard: true });
//     Await testEngine.resolveTopOfStack({ targets: [target] }, true); // resolve donald duck ability
//     Await testEngine.resolveTopOfStack({ targets: [target] }, true); // resolve minnie mouse ability
//
//     Expect(target.damage).toBe(1);
//   });
// });
//
