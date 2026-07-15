// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { neverLandMermaidLagoon } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { miracleCandle } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { daisyDuckDonaldsDate } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Miracle Candle", () => {
//   It("**ABUELA'S GIFT** Banish this item − If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: miracleCandle.cost,
//       Play: [
//         MiracleCandle,
//         DaisyDuckDonaldsDate,
//         MrSmeeBumblingMate,
//         CinderellaBallroomSensation,
//         NeverLandMermaidLagoon,
//       ],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(miracleCandle);
//     Const target = testEngine.getCardModel(neverLandMermaidLagoon);
//
//     Target.updateCardDamage(3, "add");
//     CardUnderTest.activate();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toEqual(1);
//     Expect(testEngine.getCardZone(cardUnderTest)).toBe("discard");
//     Expect(testEngine.getPlayerLore()).toBe(2);
//   });
//
//   It("Under 3 characters in play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: miracleCandle.cost,
//       Play: [
//         MiracleCandle,
//         DaisyDuckDonaldsDate,
//         CinderellaBallroomSensation,
//         NeverLandMermaidLagoon,
//       ],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(miracleCandle);
//     Const target = testEngine.getCardModel(neverLandMermaidLagoon);
//
//     Target.updateCardDamage(3, "add");
//     CardUnderTest.activate();
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Expect(target.meta.damage).toEqual(3);
//     Expect(testEngine.getPlayerLore()).toBe(0);
//   });
// });
//
