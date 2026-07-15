// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/130-dragon-fire";
// Import {
//   CruellaDeVilStyleIcon,
//   MulanInjuredSoldier,
//   NalaUndauntedLioness,
//   RoxannePowerlineFan,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cruella De Vil - Style Icon", () => {
//   It("OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: dragonFire.cost,
//         Play: [cruellaDeVilStyleIcon],
//         Hand: [dragonFire],
//         Deck: 5,
//       },
//       {
//         Play: [nalaUndauntedLioness],
//       },
//     );
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ deck: 5, inkwell: dragonFire.cost }),
//     );
//
//     Await testEngine.playCard(
//       DragonFire,
//       { targets: [nalaUndauntedLioness] },
//       True,
//     );
//     // await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ deck: 4, inkwell: dragonFire.cost + 1 }),
//     );
//   });
//
//   It("INSULTING REMARK During your turn, each opposing character with cost 2 or less gets...", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [cruellaDeVilStyleIcon, mulanInjuredSoldier],
//       },
//       {
//         Play: [roxannePowerlineFan],
//       },
//     );
//
//     Expect(testEngine.getCardModel(mulanInjuredSoldier).strength).toEqual(
//       MulanInjuredSoldier.strength,
//     );
//     Expect(testEngine.getCardModel(roxannePowerlineFan).strength).toEqual(
//       RoxannePowerlineFan.strength - 1,
//     );
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(roxannePowerlineFan).strength).toEqual(
//       RoxannePowerlineFan.strength,
//     );
//   });
// });
//
