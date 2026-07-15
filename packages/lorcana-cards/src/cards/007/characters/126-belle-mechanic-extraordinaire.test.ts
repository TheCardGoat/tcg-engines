// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AmberCoil,
//   BaymaxsChargingStation,
//   BelleMechanicExtraordinaire,
//   RubyCoil,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Belle - Mechanic Extraordinaire", () => {
//   It("Shift 7", async () => {
//     Const testEngine = new TestEngine({
//       Play: [belleMechanicExtraordinaire],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(belleMechanicExtraordinaire);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("SALVAGE For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.", async () => {
//     Const discard = [baymaxsChargingStation, amberCoil, rubyCoil];
//     Const testEngine = new TestEngine({
//       Discard: discard,
//       Hand: [belleMechanicExtraordinaire],
//     });
//
//     Expect(
//       TestEngine.getCardModel(belleMechanicExtraordinaire).shiftInkCost,
//     ).toBe(7 - discard.length);
//   });
//
//   Describe("REPURPOSE Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.", () => {
//     It("Moving 3", async () => {
//       Const discard = [baymaxsChargingStation, amberCoil, rubyCoil];
//
//       Const testEngine = new TestEngine({
//         Discard,
//         Play: [belleMechanicExtraordinaire],
//       });
//
//       Await testEngine.questCard(belleMechanicExtraordinaire, {
//         Targets: discard,
//       });
//
//       Expect(testEngine.getLoreForPlayer()).toBe(
//         Discard.length + belleMechanicExtraordinaire.lore,
//       );
//
//       For (const card of discard) {
//         Expect(testEngine.getCardModel(card).zone).toBe("deck");
//       }
//     });
//
//     It("Moving 1", async () => {
//       Const discard = [baymaxsChargingStation];
//
//       Const testEngine = new TestEngine({
//         Discard,
//         Play: [belleMechanicExtraordinaire],
//       });
//
//       Await testEngine.questCard(belleMechanicExtraordinaire, {
//         Targets: discard,
//       });
//
//       Expect(testEngine.getLoreForPlayer()).toBe(
//         Discard.length + belleMechanicExtraordinaire.lore,
//       );
//
//       For (const card of discard) {
//         Expect(testEngine.getCardModel(card).zone).toBe("deck");
//       }
//     });
//   });
// });
//
