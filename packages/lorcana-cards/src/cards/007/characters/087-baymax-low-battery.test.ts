// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { baymaxLowBattery } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("SHHHHH This character enters play exerted.", () => {
//   it("should enter exerted", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [],
//       hand: [baymaxLowBattery],
//     });
//
//     await testEngine.playCard(baymaxLowBattery);
//
//     expect(testEngine.getCardModel(baymaxLowBattery).meta.exerted).toBeTruthy();
//   });
// });
//
