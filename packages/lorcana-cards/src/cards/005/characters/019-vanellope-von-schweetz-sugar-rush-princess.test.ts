// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { describe, expect, it } from "@jest/globals";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   daisyDuckDonaldsDate,
//   princeNaveenUkulelePlayer,
//   vanellopeVonSchweetzSugarRushChamp,
//   vanellopeVonSchweetzSugarRushPrincess,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Vanellope von Schweetz - Sugar Rush Princess", () => {
//   it("Shift", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 2,
//       hand: [vanellopeVonSchweetzSugarRushPrincess],
//       play: [vanellopeVonSchweetzSugarRushChamp],
//     });
//
//     await testEngine.shiftCard({
//       shifted: vanellopeVonSchweetzSugarRushChamp,
//       shifter: vanellopeVonSchweetzSugarRushPrincess,
//     });
//     expect(
//       testEngine.getCardModel(vanellopeVonSchweetzSugarRushChamp).zone,
//     ).toBe("play");
//   });
//
//   it("**I HEARBY DECREE** Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: vanellopeVonSchweetzSugarRushChamp.cost,
//         hand: [vanellopeVonSchweetzSugarRushChamp],
//         play: [vanellopeVonSchweetzSugarRushPrincess],
//       },
//       {
//         play: [daisyDuckDonaldsDate, princeNaveenUkulelePlayer],
//       },
//     );
//
//     const trigger = testEngine.getCardModel(vanellopeVonSchweetzSugarRushChamp);
//     const target1 = testEngine.getCardModel(daisyDuckDonaldsDate);
//     const target2 = testEngine.getCardModel(princeNaveenUkulelePlayer);
//
//     expect(target1.strength).toBe(daisyDuckDonaldsDate.strength);
//     expect(target2.strength).toBe(princeNaveenUkulelePlayer.strength);
//     await testEngine.playCard(trigger);
//     expect(target1.strength).toBe(daisyDuckDonaldsDate.strength - 1);
//     expect(target2.strength).toBe(princeNaveenUkulelePlayer.strength - 1);
//
//     await testEngine.passTurn();
//     await testEngine.passTurn();
//
//     expect(target1.strength).toBe(daisyDuckDonaldsDate.strength);
//     expect(target2.strength).toBe(princeNaveenUkulelePlayer.strength);
//   });
//
//   it("Triggers when playing Ariel - Spectacular Singer (another Princess)", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: arielSpectacularSinger.cost,
//         hand: [arielSpectacularSinger],
//         play: [vanellopeVonSchweetzSugarRushPrincess],
//       },
//       {
//         play: [daisyDuckDonaldsDate],
//       },
//     );
//
//     const trigger = testEngine.getCardModel(arielSpectacularSinger);
//     const target = testEngine.getCardModel(daisyDuckDonaldsDate);
//
//     await testEngine.playCard(trigger, {});
//
//     const deck = testEngine.getCardsByZone("deck");
//     const top4 = deck.slice(-4);
//
//     await testEngine.resolveTopOfStack(
//       {
//         scry: {
//           bottom: top4,
//         },
//       },
//       true,
//     );
//     expect(target.strength).toBe(daisyDuckDonaldsDate.strength - 1);
//   });
//
//   it("Triggers when playing another copy of Vanellope von Schweetz - Sugar Rush Princess", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: vanellopeVonSchweetzSugarRushPrincess.cost,
//         hand: [vanellopeVonSchweetzSugarRushPrincess],
//         play: [vanellopeVonSchweetzSugarRushPrincess],
//       },
//       {
//         play: [daisyDuckDonaldsDate],
//       },
//     );
//
//     const handCards = testEngine.getCardsByZone("hand");
//     const trigger = handCards?.find(
//       (c) => c.lorcanitoCard.id === vanellopeVonSchweetzSugarRushPrincess.id,
//     );
//
//     if (!trigger) {
//       throw new Error("Could not find trigger card in hand");
//     }
//
//     const target = testEngine.getCardModel(daisyDuckDonaldsDate);
//
//     await testEngine.playCard(trigger, {});
//     expect(target.strength).toBe(daisyDuckDonaldsDate.strength - 1);
//   });
//
//   it("Triggers when Shifting another Princess", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: 10,
//         hand: [vanellopeVonSchweetzSugarRushPrincess],
//         play: [
//           vanellopeVonSchweetzSugarRushPrincess,
//           vanellopeVonSchweetzSugarRushChamp,
//         ],
//       },
//       {
//         play: [daisyDuckDonaldsDate],
//       },
//     );
//
//     const handCards = testEngine.getCardsByZone("hand");
//     const shifter = handCards?.find(
//       (c) => c.lorcanitoCard.id === vanellopeVonSchweetzSugarRushPrincess.id,
//     );
//     const playCards = testEngine.getCardsByZone("play");
//     const shifted = playCards?.find(
//       (c) => c.lorcanitoCard.id === vanellopeVonSchweetzSugarRushChamp.id,
//     );
//     const target = testEngine
//       .getCardsByZone("play", "player_two")
//       ?.find((c) => c.lorcanitoCard.id === daisyDuckDonaldsDate.id);
//
//     if (!(shifter && shifted && target)) {
//       throw new Error("Could not find shifter, shifted, or target card");
//     }
//
//     await testEngine.shiftCard({
//       shifter: shifter,
//       shifted: shifted.lorcanitoCard as LorcanitoCharacterCard,
//     });
//
//     // testEngine.resolveTopOfStack({});
//     expect(target.strength).toBe(daisyDuckDonaldsDate.strength - 1);
//   });
// });
//
