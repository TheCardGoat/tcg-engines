// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   beastFrustratedDesigner,
//   mulanImperialGeneral,
//   theGlassSlipper,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Glass Slipper", () => {
//   it("SEARCH THE KINGDOM Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.", async () => {
//     const testEngine = new TestEngine({
//       deck: [mulanImperialGeneral],
//       play: [theGlassSlipper, beastFrustratedDesigner],
//     });
//
//     await testEngine.activateCard(theGlassSlipper, {
//       costs: [beastFrustratedDesigner],
//     });
//     expect(testEngine.getCardModel(theGlassSlipper).zone).toEqual("discard");
//     expect(testEngine.getCardModel(beastFrustratedDesigner).exerted).toEqual(
//       true,
//     );
//
//     await testEngine.resolveTopOfStack({ targets: [mulanImperialGeneral] });
//     expect(testEngine.getCardModel(mulanImperialGeneral).zone).toEqual("hand");
//   });
//
//   it("should allow using a wet (played this turn) Prince character to pay the exert cost", async () => {
//     const testEngine = new TestEngine({
//       deck: [mulanImperialGeneral],
//       inkwell: beastFrustratedDesigner.cost,
//       hand: [beastFrustratedDesigner],
//       play: [theGlassSlipper],
//     });
//
//     // Play the Prince character this turn (making it wet)
//     await testEngine.playCard(beastFrustratedDesigner);
//
//     // Verify the character is wet (played this turn)
//     const prince = testEngine.getCardModel(beastFrustratedDesigner);
//     expect(prince.isWet).toBe(true);
//     expect(prince.ready).toBe(true); // Should still be ready
//
//     // Activate The Glass Slipper using the wet Prince character
//     await testEngine.activateCard(theGlassSlipper, {
//       costs: [beastFrustratedDesigner],
//     });
//
//     // Verify costs were paid
//     expect(testEngine.getCardModel(theGlassSlipper).zone).toEqual("discard");
//     expect(testEngine.getCardModel(beastFrustratedDesigner).exerted).toEqual(
//       true,
//     );
//
//     // Resolve the ability
//     await testEngine.resolveTopOfStack({ targets: [mulanImperialGeneral] });
//     expect(testEngine.getCardModel(mulanImperialGeneral).zone).toEqual("hand");
//   });
// });
//
