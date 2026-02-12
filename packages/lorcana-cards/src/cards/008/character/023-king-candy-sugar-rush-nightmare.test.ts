// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { wreckitRalphAdmiralUnderpants } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { candleheadDedicatedRacer } from "@lorcanito/lorcana-engine/cards/007";
// Import {
//   GloydOrangeboarFierceCompetitor,
//   KingCandySugarRushNightmare,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("King Candy - Sugar Rush Nightmare", () => {
//   It("A NEW ROSTER When this character is banished, you may return another Racer character card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: dragonFire.cost,
//       Play: [kingCandySugarRushNightmare],
//       Hand: [dragonFire],
//       Discard: [candleheadDedicatedRacer],
//     });
//
//     Await testEngine.playCard(
//       DragonFire,
//       {
//         Targets: [kingCandySugarRushNightmare],
//       },
//       True,
//     );
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [candleheadDedicatedRacer] });
//
//     Expect(testEngine.getCardModel(candleheadDedicatedRacer).zone).toBe("hand");
//   });
//
//   It("A NEW ROSTER Only racers return", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: dragonFire.cost,
//       Play: [kingCandySugarRushNightmare],
//       Hand: [dragonFire],
//       Discard: [wreckitRalphAdmiralUnderpants, gloydOrangeboarFierceCompetitor],
//     });
//
//     Await testEngine.playCard(
//       DragonFire,
//       {
//         Targets: [kingCandySugarRushNightmare],
//       },
//       True,
//     );
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       { targets: [wreckitRalphAdmiralUnderpants] },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(wreckitRalphAdmiralUnderpants).zone).toBe(
//       "discard",
//     );
//   });
// });
//
// Describe("Regression tests", () => {
//   It("Cannot Return Himself", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: dragonFire.cost,
//       Play: [kingCandySugarRushNightmare],
//       Hand: [dragonFire],
//       Discard: [],
//     });
//
//     Await testEngine.playCard(
//       DragonFire,
//       {
//         Targets: [kingCandySugarRushNightmare],
//       },
//       True,
//     );
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getCardModel(kingCandySugarRushNightmare).zone).toBe(
//       "discard",
//     );
//   });
// });
//
