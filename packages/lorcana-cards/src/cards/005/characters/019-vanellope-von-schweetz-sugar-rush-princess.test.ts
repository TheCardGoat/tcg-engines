// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { describe, expect, it } from "@jest/globals";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   DaisyDuckDonaldsDate,
//   PrinceNaveenUkulelePlayer,
//   VanellopeVonSchweetzSugarRushChamp,
//   VanellopeVonSchweetzSugarRushPrincess,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Vanellope von Schweetz - Sugar Rush Princess", () => {
//   It("Shift", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 2,
//       Hand: [vanellopeVonSchweetzSugarRushPrincess],
//       Play: [vanellopeVonSchweetzSugarRushChamp],
//     });
//
//     Await testEngine.shiftCard({
//       Shifted: vanellopeVonSchweetzSugarRushChamp,
//       Shifter: vanellopeVonSchweetzSugarRushPrincess,
//     });
//     Expect(
//       TestEngine.getCardModel(vanellopeVonSchweetzSugarRushChamp).zone,
//     ).toBe("play");
//   });
//
//   It("**I HEARBY DECREE** Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: vanellopeVonSchweetzSugarRushChamp.cost,
//         Hand: [vanellopeVonSchweetzSugarRushChamp],
//         Play: [vanellopeVonSchweetzSugarRushPrincess],
//       },
//       {
//         Play: [daisyDuckDonaldsDate, princeNaveenUkulelePlayer],
//       },
//     );
//
//     Const trigger = testEngine.getCardModel(vanellopeVonSchweetzSugarRushChamp);
//     Const target1 = testEngine.getCardModel(daisyDuckDonaldsDate);
//     Const target2 = testEngine.getCardModel(princeNaveenUkulelePlayer);
//
//     Expect(target1.strength).toBe(daisyDuckDonaldsDate.strength);
//     Expect(target2.strength).toBe(princeNaveenUkulelePlayer.strength);
//     Await testEngine.playCard(trigger);
//     Expect(target1.strength).toBe(daisyDuckDonaldsDate.strength - 1);
//     Expect(target2.strength).toBe(princeNaveenUkulelePlayer.strength - 1);
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Expect(target1.strength).toBe(daisyDuckDonaldsDate.strength);
//     Expect(target2.strength).toBe(princeNaveenUkulelePlayer.strength);
//   });
//
//   It("Triggers when playing Ariel - Spectacular Singer (another Princess)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: arielSpectacularSinger.cost,
//         Hand: [arielSpectacularSinger],
//         Play: [vanellopeVonSchweetzSugarRushPrincess],
//       },
//       {
//         Play: [daisyDuckDonaldsDate],
//       },
//     );
//
//     Const trigger = testEngine.getCardModel(arielSpectacularSinger);
//     Const target = testEngine.getCardModel(daisyDuckDonaldsDate);
//
//     Await testEngine.playCard(trigger, {});
//
//     Const deck = testEngine.getCardsByZone("deck");
//     Const top4 = deck.slice(-4);
//
//     Await testEngine.resolveTopOfStack(
//       {
//         Scry: {
//           Bottom: top4,
//         },
//       },
//       True,
//     );
//     Expect(target.strength).toBe(daisyDuckDonaldsDate.strength - 1);
//   });
//
//   It("Triggers when playing another copy of Vanellope von Schweetz - Sugar Rush Princess", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: vanellopeVonSchweetzSugarRushPrincess.cost,
//         Hand: [vanellopeVonSchweetzSugarRushPrincess],
//         Play: [vanellopeVonSchweetzSugarRushPrincess],
//       },
//       {
//         Play: [daisyDuckDonaldsDate],
//       },
//     );
//
//     Const handCards = testEngine.getCardsByZone("hand");
//     Const trigger = handCards?.find(
//       (c) => c.lorcanitoCard.id === vanellopeVonSchweetzSugarRushPrincess.id,
//     );
//
//     If (!trigger) {
//       Throw new Error("Could not find trigger card in hand");
//     }
//
//     Const target = testEngine.getCardModel(daisyDuckDonaldsDate);
//
//     Await testEngine.playCard(trigger, {});
//     Expect(target.strength).toBe(daisyDuckDonaldsDate.strength - 1);
//   });
//
//   It("Triggers when Shifting another Princess", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 10,
//         Hand: [vanellopeVonSchweetzSugarRushPrincess],
//         Play: [
//           VanellopeVonSchweetzSugarRushPrincess,
//           VanellopeVonSchweetzSugarRushChamp,
//         ],
//       },
//       {
//         Play: [daisyDuckDonaldsDate],
//       },
//     );
//
//     Const handCards = testEngine.getCardsByZone("hand");
//     Const shifter = handCards?.find(
//       (c) => c.lorcanitoCard.id === vanellopeVonSchweetzSugarRushPrincess.id,
//     );
//     Const playCards = testEngine.getCardsByZone("play");
//     Const shifted = playCards?.find(
//       (c) => c.lorcanitoCard.id === vanellopeVonSchweetzSugarRushChamp.id,
//     );
//     Const target = testEngine
//       .getCardsByZone("play", "player_two")
//       ?.find((c) => c.lorcanitoCard.id === daisyDuckDonaldsDate.id);
//
//     If (!(shifter && shifted && target)) {
//       Throw new Error("Could not find shifter, shifted, or target card");
//     }
//
//     Await testEngine.shiftCard({
//       Shifter: shifter,
//       Shifted: shifted.lorcanitoCard as LorcanitoCharacterCard,
//     });
//
//     // testEngine.resolveTopOfStack({});
//     Expect(target.strength).toBe(daisyDuckDonaldsDate.strength - 1);
//   });
// });
//
