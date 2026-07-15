// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { teKaTheBurningOne } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { annaMysticalMajesty } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   MufasaAmongTheStars,
//   TeKaElementalTerror,
//   ThomasOmalleyFelineCharmer,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Te Kā - Elemental Terror", () => {
//   It("Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Te Kā.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: teKaElementalTerror.cost,
//       Play: [teKaTheBurningOne],
//       Hand: [teKaElementalTerror],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(teKaElementalTerror);
//     Expect(cardUnderTest.hasShift).toBe(true);
//
//     Await testEngine.shiftCard({
//       Shifted: teKaTheBurningOne,
//       Shifter: teKaElementalTerror,
//     });
//
//     Expect(testEngine.getCardZone(teKaElementalTerror)).toBe("play");
//   });
//
//   It("ANCIENT RAGE During your turn, whenever an opposing character is exerted, banish them.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: annaMysticalMajesty.cost,
//         Hand: [annaMysticalMajesty],
//         Play: [teKaElementalTerror],
//       },
//       {
//         Play: [mufasaAmongTheStars, thomasOmalleyFelineCharmer],
//       },
//     );
//
//     // Anna exerts all opposing characters
//     Await testEngine.playCard(annaMysticalMajesty);
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getCardZone(mufasaAmongTheStars)).toBe("discard");
//     Expect(testEngine.getCardZone(thomasOmalleyFelineCharmer)).toBe("discard");
//   });
// });
//
