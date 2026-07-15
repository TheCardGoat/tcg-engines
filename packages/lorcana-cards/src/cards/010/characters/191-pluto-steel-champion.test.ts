// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FrancineEyeingTheEvidence,
//   PlutoSteelChampion,
//   RecoveredPage,
//   TheSultanPlayfulMonarch,
//   TinkerBellFancyFootwork,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pluto - Steel Champion", () => {
//   It("WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore. MAKE ROOM Whenever you play another Steel character, you may banish chosen item.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [plutoSteelChampion, francineEyeingTheEvidence],
//       },
//       {
//         Play: [theSultanPlayfulMonarch, tinkerBellFancyFootwork],
//       },
//     );
//
//     Await testEngine.exertCard(theSultanPlayfulMonarch);
//     Await testEngine.exertCard(tinkerBellFancyFootwork);
//
//     Await testEngine.challenge({
//       Attacker: francineEyeingTheEvidence,
//       Defender: theSultanPlayfulMonarch,
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//
//     // Pluto should not trigger on self
//     Await testEngine.challenge({
//       Attacker: plutoSteelChampion,
//       Defender: tinkerBellFancyFootwork,
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
//
//   It("MAKE ROOM Whenever you play another Steel character, you may banish chosen item.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: plutoSteelChampion.cost + francineEyeingTheEvidence.cost,
//         Hand: [plutoSteelChampion, francineEyeingTheEvidence],
//       },
//       {
//         Play: [recoveredPage],
//       },
//     );
//
//     Await testEngine.playCard(plutoSteelChampion);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Await testEngine.playCard(francineEyeingTheEvidence);
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [recoveredPage] });
//
//     Expect(testEngine.getCardModel(recoveredPage).zone).toBe("discard");
//   });
// });
//
// Describe("Regression", () => {
//   It("Do not banish item when playing pluto", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: plutoSteelChampion.cost,
//         Hand: [plutoSteelChampion],
//       },
//       {
//         Play: [recoveredPage],
//       },
//     );
//
//     Await testEngine.playCard(plutoSteelChampion);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Expect(testEngine.getCardModel(recoveredPage).zone).toBe("play");
//   });
// });
//
