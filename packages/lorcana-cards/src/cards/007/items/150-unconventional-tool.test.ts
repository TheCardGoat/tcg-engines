// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   BaymaxsChargingStation,
//   UnconventionalTool,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Unconventional Tool", () => {
//   It("FIXED IN NO TIME When this item is banished, you pay 2 {I} less for the next item you play this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Deck: 4,
//       Play: [unconventionalTool, hiramFlavershamToymaker],
//       Hand: [baymaxsChargingStation],
//     });
//
//     Const target = testEngine.getCardModel(baymaxsChargingStation);
//     Expect(target.cost).toBe(baymaxsChargingStation.cost);
//
//     Await testEngine.questCard(hiramFlavershamToymaker);
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [unconventionalTool] });
//
//     Expect(target.cost).toBe(baymaxsChargingStation.cost - 2);
//   });
// });
//
