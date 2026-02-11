// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { heiheiBoatSnack } from "@lorcanito/lorcana-engine/cards/001/characters/007-heihei-boat-snack";
// Import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/135-shield-of-virtue";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/149-hiram-flaversham-toymaker";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/157-tipo-growing-son";
// Import {
//   CharlotteLaBouffMardiGrasPrincess,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { mulanConsiderateDiplomat } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mulan - Considerate Diplomat", () => {
//   It("IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mulanConsiderateDiplomat],
//       Deck: [
//         ShieldOfVirtue,
//         HeiheiBoatSnack,
//         DeweyLovableShowoff,
//         CharlotteLaBouffMardiGrasPrincess,
//         TipoGrowingSon,
//         HiramFlavershamToymaker,
//       ],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mulanConsiderateDiplomat);
//     Const princess = testEngine.getCardModel(charlotteLaBouffMardiGrasPrincess);
//
//     Await testEngine.questCard(cardUnderTest);
//
//     Await testEngine.resolveTopOfStack({
//       Scry: {
//         Bottom: [hiramFlavershamToymaker, tipoGrowingSon, deweyLovableShowoff],
//         Hand: [charlotteLaBouffMardiGrasPrincess],
//       },
//     });
//
//     Expect(testEngine.getCardZone(princess)).toEqual("hand");
//
//     Const bottomCard = testEngine.testStore.getZonesCards().deck[0];
//     Const secondBottomCard = testEngine.testStore.getZonesCards().deck[1];
//     Const thirdBottomCard = testEngine.testStore.getZonesCards().deck[2];
//
//     Expect(bottomCard?.lorcanitoCard?.name).toEqual(
//       HiramFlavershamToymaker.name,
//     );
//     Expect(secondBottomCard?.lorcanitoCard?.name).toEqual(tipoGrowingSon.name);
//     Expect(thirdBottomCard?.lorcanitoCard?.name).toEqual(
//       DeweyLovableShowoff.name,
//     );
//   });
// });
//
