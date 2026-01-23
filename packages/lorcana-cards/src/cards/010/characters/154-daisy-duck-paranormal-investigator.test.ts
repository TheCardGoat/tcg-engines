// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { fishboneQuill } from "@lorcanito/lorcana-engine/cards/001/items/168-fishbone-quill";
// import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/157-tipo-growing-son";
// import { tipoJuniorChipmunk } from "@lorcanito/lorcana-engine/cards/008";
// import { daisyDuckParanormalInvestigator } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Daisy Duck - Paranormal Investigator", () => {
//   it("does NOT exert opponent cards entering inkwell when Daisy is NOT exerted", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [fishboneQuill],
//         hand: [tipoGrowingSon, tipoJuniorChipmunk],
//       },
//       {
//         play: [daisyDuckParanormalInvestigator],
//       },
//     );
//
//     // Sanity: ensure Daisy starts not exerted
//     expect(
//       testEngine.getCardModel(daisyDuckParanormalInvestigator).exerted,
//     ).toBe(false);
//
//     // Put a card into the opponent's inkwell — should NOT be exerted because Daisy is not exerted
//     await testEngine.putIntoInkwell(tipoJuniorChipmunk);
//     expect(testEngine.getCardModel(tipoJuniorChipmunk).exerted).toBe(false);
//
//     // Activate fishbone quill to put card into inkwell again
//     const fishboneQuillModel = testEngine.getCardModel(fishboneQuill);
//     const tipoGrowingSonModel = testEngine.getCardModel(tipoGrowingSon);
//     await fishboneQuillModel.activate();
//     testEngine.resolveTopOfStack({ targets: [tipoGrowingSonModel] });
//     expect(tipoGrowingSonModel.exerted).toBe(false);
//   });
//
//   it("exerts opponent cards entering inkwell when Daisy IS exerted", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [fishboneQuill],
//         hand: [tipoGrowingSon, tipoJuniorChipmunk],
//       },
//       {
//         play: [daisyDuckParanormalInvestigator],
//       },
//     );
//
//     // Exert Daisy directly in the test harness
//     await testEngine.exertCard(daisyDuckParanormalInvestigator);
//     expect(
//       testEngine.getCardModel(daisyDuckParanormalInvestigator).exerted,
//     ).toBe(true);
//
//     // Now when a card is put into the opponent's inkwell it should enter exerted
//     await testEngine.putIntoInkwell(tipoJuniorChipmunk);
//     expect(testEngine.getCardModel(tipoJuniorChipmunk).exerted).toBe(true);
//
//     // Activate fishbone quill to put card into inkwell again
//     const fishboneQuillModel = testEngine.getCardModel(fishboneQuill);
//     const tipoGrowingSonModel = testEngine.getCardModel(tipoGrowingSon);
//     await fishboneQuillModel.activate();
//     testEngine.resolveTopOfStack({ targets: [tipoGrowingSonModel] });
//     expect(tipoGrowingSonModel.exerted).toBe(true);
//   });
//
//   it("does NOT exert opponent cards entering play when Daisy IS exerted", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: tipoJuniorChipmunk.cost,
//         play: [fishboneQuill],
//         hand: [tipoGrowingSon, tipoJuniorChipmunk],
//       },
//       {
//         play: [daisyDuckParanormalInvestigator],
//       },
//     );
//
//     // Exert Daisy directly in the test harness
//     await testEngine.exertCard(daisyDuckParanormalInvestigator);
//     expect(
//       testEngine.getCardModel(daisyDuckParanormalInvestigator).exerted,
//     ).toBe(true);
//
//     await testEngine.playCard(tipoJuniorChipmunk);
//
//     // tipoJuniorChipmunk should NOT be exerted
//     expect(testEngine.getCardModel(tipoJuniorChipmunk).exerted).toBe(false);
//   });
// });
//
