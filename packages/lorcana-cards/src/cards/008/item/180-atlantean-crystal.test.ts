// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AtlanteanCrystal,
//   GoGoTomagoMechanicalEngineer,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Atlantean Crystal", () => {
//   It("SHIELDING LIGHT {E}, 2 {I} – Chosen character gains Resist +2 and Support until the start of your next turn. (Damage dealt to them is reduced by 2. Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 2,
//       Play: [atlanteanCrystal, goGoTomagoMechanicalEngineer],
//     });
//
//     Expect(
//       TestEngine.getCardModel(goGoTomagoMechanicalEngineer).hasResist,
//     ).toBe(false);
//     Expect(
//       TestEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
//     ).toBe(false);
//
//     Await testEngine.activateCard(atlanteanCrystal, {
//       Targets: [goGoTomagoMechanicalEngineer],
//     });
//
//     Expect(
//       TestEngine.getCardModel(goGoTomagoMechanicalEngineer).hasResist,
//     ).toBe(true);
//     Expect(
//       TestEngine.getCardModel(goGoTomagoMechanicalEngineer).hasSupport,
//     ).toBe(true);
//   });
// });
//
