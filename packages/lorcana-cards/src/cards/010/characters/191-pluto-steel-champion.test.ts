// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   francineEyeingTheEvidence,
//   plutoSteelChampion,
//   recoveredPage,
//   theSultanPlayfulMonarch,
//   tinkerBellFancyFootwork,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pluto - Steel Champion", () => {
//   it("WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore. MAKE ROOM Whenever you play another Steel character, you may banish chosen item.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [plutoSteelChampion, francineEyeingTheEvidence],
//       },
//       {
//         play: [theSultanPlayfulMonarch, tinkerBellFancyFootwork],
//       },
//     );
//
//     await testEngine.exertCard(theSultanPlayfulMonarch);
//     await testEngine.exertCard(tinkerBellFancyFootwork);
//
//     await testEngine.challenge({
//       attacker: francineEyeingTheEvidence,
//       defender: theSultanPlayfulMonarch,
//     });
//
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//
//     // Pluto should not trigger on self
//     await testEngine.challenge({
//       attacker: plutoSteelChampion,
//       defender: tinkerBellFancyFootwork,
//     });
//
//     expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
//
//   it("MAKE ROOM Whenever you play another Steel character, you may banish chosen item.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: plutoSteelChampion.cost + francineEyeingTheEvidence.cost,
//         hand: [plutoSteelChampion, francineEyeingTheEvidence],
//       },
//       {
//         play: [recoveredPage],
//       },
//     );
//
//     await testEngine.playCard(plutoSteelChampion);
//     expect(testEngine.stackLayers).toHaveLength(0);
//
//     await testEngine.playCard(francineEyeingTheEvidence);
//     expect(testEngine.stackLayers).toHaveLength(1);
//
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [recoveredPage] });
//
//     expect(testEngine.getCardModel(recoveredPage).zone).toBe("discard");
//   });
// });
//
// describe("Regression", () => {
//   it("Do not banish item when playing pluto", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: plutoSteelChampion.cost,
//         hand: [plutoSteelChampion],
//       },
//       {
//         play: [recoveredPage],
//       },
//     );
//
//     await testEngine.playCard(plutoSteelChampion);
//     expect(testEngine.stackLayers).toHaveLength(0);
//
//     expect(testEngine.getCardModel(recoveredPage).zone).toBe("play");
//   });
// });
//
