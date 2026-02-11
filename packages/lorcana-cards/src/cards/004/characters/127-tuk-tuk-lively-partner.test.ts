// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { tukTukLivelyPartner } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   RapunzelsTowerSecludedPrison,
//   SevenDwarfsMineSecureFortress,
// } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tuk Tuk - Lively Partner", () => {
//   It("**ON A ROLL** When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: tukTukLivelyPartner.cost,
//       Hand: [tukTukLivelyPartner],
//       Play: [rapunzelsTowerSecludedPrison, liloMakingAWish],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(tukTukLivelyPartner);
//     Const locationUnderTest = testEngine.getCardModel(
//       RapunzelsTowerSecludedPrison,
//     );
//     Const targetCharacterUnderTest = testEngine.getCardModel(liloMakingAWish);
//
//     Await testEngine.playCard(tukTukLivelyPartner);
//     Await testEngine.resolveOptionalAbility();
//
//     Await testEngine.resolveTopOfStack(
//       { targets: [targetCharacterUnderTest] },
//       True,
//     );
//     Await testEngine.resolveTopOfStack({ targets: [locationUnderTest] }, true);
//
//     Expect(targetCharacterUnderTest.isAtLocation(locationUnderTest)).toBe(true);
//     Expect(cardUnderTest.isAtLocation(locationUnderTest)).toBe(true);
//     Expect(targetCharacterUnderTest.strength).toBe(
//       LiloMakingAWish.strength + 2,
//     );
//   });
// });
//
// Describe("Regression", () => {
//   It("Should be able to enter the mines", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: sevenDwarfsMineSecureFortress.moveCost,
//       Play: [tukTukLivelyPartner, sevenDwarfsMineSecureFortress],
//     });
//
//     Const { location, character } = await testEngine.moveToLocation({
//       Location: sevenDwarfsMineSecureFortress,
//       Character: tukTukLivelyPartner,
//     });
//
//     Expect(character.isAtLocation(location)).toBe(true);
//     Expect(location.containsCharacter(character)).toBe(true);
//   });
// });
//
