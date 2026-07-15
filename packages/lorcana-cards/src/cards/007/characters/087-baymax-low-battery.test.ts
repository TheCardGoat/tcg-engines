// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { baymaxLowBattery } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("SHHHHH This character enters play exerted.", () => {
//   It("should enter exerted", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [],
//       Hand: [baymaxLowBattery],
//     });
//
//     Await testEngine.playCard(baymaxLowBattery);
//
//     Expect(testEngine.getCardModel(baymaxLowBattery).meta.exerted).toBeTruthy();
//   });
// });
//
