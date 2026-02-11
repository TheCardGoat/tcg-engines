// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiroHamadaRoboticsProdigy } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   HiroHamadaArmorDesigner,
//   HiroHamadaFutureChampion,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hiro Hamada - Future Champion", () => {
//   It("ORIGIN STORY When you play a Floodborn character on this card, draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Deck: 3,
//       Inkwell: hiroHamadaArmorDesigner.cost,
//       Play: [hiroHamadaFutureChampion],
//       Hand: [hiroHamadaArmorDesigner],
//     });
//
//     Await testEngine.shiftCard({
//       Shifted: hiroHamadaFutureChampion,
//       Shifter: hiroHamadaArmorDesigner,
//     });
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 2,
//       }),
//     );
//   });
// });
//
// Describe("Regression", () => {
//   It("should not trigger when Hiro is not the target", async () => {
//     Const testEngine = new TestEngine({
//       Deck: 3,
//       Inkwell: hiroHamadaArmorDesigner.cost,
//       Play: [hiroHamadaFutureChampion, hiroHamadaRoboticsProdigy],
//       Hand: [hiroHamadaArmorDesigner],
//     });
//
//     Await testEngine.shiftCard({
//       Shifted: hiroHamadaRoboticsProdigy,
//       Shifter: hiroHamadaArmorDesigner,
//     });
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 0,
//         Deck: 3,
//       }),
//     );
//   });
// });
//
