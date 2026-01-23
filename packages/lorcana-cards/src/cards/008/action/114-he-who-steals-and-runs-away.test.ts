// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   atlanteanCrystal,
//   heWhoStealsAndRunsAway,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("He Who Steals And Runs Away", () => {
//   it("Banish chosen item. Draw a card.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: heWhoStealsAndRunsAway.cost,
//         hand: [heWhoStealsAndRunsAway],
//         deck: 10,
//       },
//       {
//         play: [atlanteanCrystal],
//       },
//     );
//
//     await testEngine.playCard(heWhoStealsAndRunsAway, {
//       targets: [atlanteanCrystal],
//     });
//
//     expect(testEngine.getCardModel(atlanteanCrystal).zone).toBe("discard");
//     expect(testEngine.getZonesCardCount().hand).toBe(1);
//   });
// });
//
