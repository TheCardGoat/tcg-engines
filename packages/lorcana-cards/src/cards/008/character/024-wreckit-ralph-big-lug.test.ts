// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { vanellopeVonSchweetzCandyMechanic } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { wreckitRalphBigLug } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wreck-it Ralph - Big Lug", () => {
//   It("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Wreck-It Ralph.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [wreckitRalphBigLug],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(wreckitRalphBigLug);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("BACK ON TRACK When you play this character you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: wreckitRalphBigLug.cost,
//       Hand: [wreckitRalphBigLug],
//       Discard: [vanellopeVonSchweetzCandyMechanic],
//       Lore: 0,
//     });
//
//     Await testEngine.playCard(wreckitRalphBigLug);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({
//       Targets: [vanellopeVonSchweetzCandyMechanic],
//     });
//
//     Expect(
//       TestEngine.getCardModel(vanellopeVonSchweetzCandyMechanic).zone,
//     ).toEqual("hand");
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(1);
//   });
//
//   It("BACK ON TRACK - Play - No Lore when you cannot return card", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: wreckitRalphBigLug.cost,
//       Hand: [wreckitRalphBigLug],
//       Discard: [],
//       Lore: 0,
//     });
//
//     Await testEngine.playCard(wreckitRalphBigLug);
//     Await testEngine.acceptOptionalLayer();
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(0);
//   });
//
//   It("BACK ON TRACK Whenever he quests you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: wreckitRalphBigLug.cost,
//       Play: [wreckitRalphBigLug],
//       Discard: [vanellopeVonSchweetzCandyMechanic],
//       Lore: 0,
//     });
//
//     Await testEngine.questCard(wreckitRalphBigLug);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({
//       Targets: [vanellopeVonSchweetzCandyMechanic],
//     });
//
//     Expect(
//       TestEngine.getCardModel(vanellopeVonSchweetzCandyMechanic).zone,
//     ).toEqual("hand");
//
//     //Quest Lore + ability Lore
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(2);
//   });
//
//   It("BACK ON TRACK - Quest - No Lore when you cannot return card", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: wreckitRalphBigLug.cost,
//       Play: [wreckitRalphBigLug],
//       Discard: [],
//       Lore: 0,
//     });
//
//     Await testEngine.questCard(wreckitRalphBigLug);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(1);
//   });
// });
//
