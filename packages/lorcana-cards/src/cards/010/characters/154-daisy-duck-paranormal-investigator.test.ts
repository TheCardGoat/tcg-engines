// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fishboneQuill } from "@lorcanito/lorcana-engine/cards/001/items/168-fishbone-quill";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/157-tipo-growing-son";
// Import { tipoJuniorChipmunk } from "@lorcanito/lorcana-engine/cards/008";
// Import { daisyDuckParanormalInvestigator } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Daisy Duck - Paranormal Investigator", () => {
//   It("does NOT exert opponent cards entering inkwell when Daisy is NOT exerted", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [fishboneQuill],
//         Hand: [tipoGrowingSon, tipoJuniorChipmunk],
//       },
//       {
//         Play: [daisyDuckParanormalInvestigator],
//       },
//     );
//
//     // Sanity: ensure Daisy starts not exerted
//     Expect(
//       TestEngine.getCardModel(daisyDuckParanormalInvestigator).exerted,
//     ).toBe(false);
//
//     // Put a card into the opponent's inkwell — should NOT be exerted because Daisy is not exerted
//     Await testEngine.putIntoInkwell(tipoJuniorChipmunk);
//     Expect(testEngine.getCardModel(tipoJuniorChipmunk).exerted).toBe(false);
//
//     // Activate fishbone quill to put card into inkwell again
//     Const fishboneQuillModel = testEngine.getCardModel(fishboneQuill);
//     Const tipoGrowingSonModel = testEngine.getCardModel(tipoGrowingSon);
//     Await fishboneQuillModel.activate();
//     TestEngine.resolveTopOfStack({ targets: [tipoGrowingSonModel] });
//     Expect(tipoGrowingSonModel.exerted).toBe(false);
//   });
//
//   It("exerts opponent cards entering inkwell when Daisy IS exerted", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [fishboneQuill],
//         Hand: [tipoGrowingSon, tipoJuniorChipmunk],
//       },
//       {
//         Play: [daisyDuckParanormalInvestigator],
//       },
//     );
//
//     // Exert Daisy directly in the test harness
//     Await testEngine.exertCard(daisyDuckParanormalInvestigator);
//     Expect(
//       TestEngine.getCardModel(daisyDuckParanormalInvestigator).exerted,
//     ).toBe(true);
//
//     // Now when a card is put into the opponent's inkwell it should enter exerted
//     Await testEngine.putIntoInkwell(tipoJuniorChipmunk);
//     Expect(testEngine.getCardModel(tipoJuniorChipmunk).exerted).toBe(true);
//
//     // Activate fishbone quill to put card into inkwell again
//     Const fishboneQuillModel = testEngine.getCardModel(fishboneQuill);
//     Const tipoGrowingSonModel = testEngine.getCardModel(tipoGrowingSon);
//     Await fishboneQuillModel.activate();
//     TestEngine.resolveTopOfStack({ targets: [tipoGrowingSonModel] });
//     Expect(tipoGrowingSonModel.exerted).toBe(true);
//   });
//
//   It("does NOT exert opponent cards entering play when Daisy IS exerted", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: tipoJuniorChipmunk.cost,
//         Play: [fishboneQuill],
//         Hand: [tipoGrowingSon, tipoJuniorChipmunk],
//       },
//       {
//         Play: [daisyDuckParanormalInvestigator],
//       },
//     );
//
//     // Exert Daisy directly in the test harness
//     Await testEngine.exertCard(daisyDuckParanormalInvestigator);
//     Expect(
//       TestEngine.getCardModel(daisyDuckParanormalInvestigator).exerted,
//     ).toBe(true);
//
//     Await testEngine.playCard(tipoJuniorChipmunk);
//
//     // tipoJuniorChipmunk should NOT be exerted
//     Expect(testEngine.getCardModel(tipoJuniorChipmunk).exerted).toBe(false);
//   });
// });
//
