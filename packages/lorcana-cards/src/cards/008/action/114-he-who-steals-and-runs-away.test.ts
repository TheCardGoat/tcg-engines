// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AtlanteanCrystal,
//   HeWhoStealsAndRunsAway,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("He Who Steals And Runs Away", () => {
//   It("Banish chosen item. Draw a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: heWhoStealsAndRunsAway.cost,
//         Hand: [heWhoStealsAndRunsAway],
//         Deck: 10,
//       },
//       {
//         Play: [atlanteanCrystal],
//       },
//     );
//
//     Await testEngine.playCard(heWhoStealsAndRunsAway, {
//       Targets: [atlanteanCrystal],
//     });
//
//     Expect(testEngine.getCardModel(atlanteanCrystal).zone).toBe("discard");
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//   });
// });
//
