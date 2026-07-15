// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MamaOdieVoiceOfWisdom,
//   NalaFierceFriend,
//   RobinHoodBelovedOutlaw,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { theQueensCastleMirrorChamber } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Queen's Castle - Mirror Chamber", () => {
//   It("**USING THE MIRROR** At the start of your turn, for each character you have here, you may draw a card.", () => {
//     Const testEngine = new TestEngine(
//       {},
//       {
//         Inkwell: theQueensCastleMirrorChamber.cost,
//         Play: [
//           TheQueensCastleMirrorChamber,
//           MamaOdieVoiceOfWisdom,
//           RobinHoodBelovedOutlaw,
//           NalaFierceFriend,
//         ],
//         Deck: 5,
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(theQueensCastleMirrorChamber);
//     Const mamaOdie = testEngine.getCardModel(mamaOdieVoiceOfWisdom);
//     Const robinHood = testEngine.getCardModel(robinHoodBelovedOutlaw);
//     Const nala = testEngine.getCardModel(nalaFierceFriend);
//
//     [mamaOdie, robinHood, nala].forEach((character) => {
//       Character.enterLocation(cardUnderTest);
//     });
//
//     TestEngine.passTurn();
//
//     Expect(testEngine.getZonesCardCount("player_two").deck).toBe(5);
//     TestEngine.resolveOptionalAbility();
//     Expect(testEngine.getZonesCardCount("player_two").deck).toBe(1);
//   });
// });
//
