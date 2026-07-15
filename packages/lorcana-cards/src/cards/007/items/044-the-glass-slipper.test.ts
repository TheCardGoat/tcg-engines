// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BeastFrustratedDesigner,
//   MulanImperialGeneral,
//   TheGlassSlipper,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Glass Slipper", () => {
//   It("SEARCH THE KINGDOM Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Deck: [mulanImperialGeneral],
//       Play: [theGlassSlipper, beastFrustratedDesigner],
//     });
//
//     Await testEngine.activateCard(theGlassSlipper, {
//       Costs: [beastFrustratedDesigner],
//     });
//     Expect(testEngine.getCardModel(theGlassSlipper).zone).toEqual("discard");
//     Expect(testEngine.getCardModel(beastFrustratedDesigner).exerted).toEqual(
//       True,
//     );
//
//     Await testEngine.resolveTopOfStack({ targets: [mulanImperialGeneral] });
//     Expect(testEngine.getCardModel(mulanImperialGeneral).zone).toEqual("hand");
//   });
//
//   It("should allow using a wet (played this turn) Prince character to pay the exert cost", async () => {
//     Const testEngine = new TestEngine({
//       Deck: [mulanImperialGeneral],
//       Inkwell: beastFrustratedDesigner.cost,
//       Hand: [beastFrustratedDesigner],
//       Play: [theGlassSlipper],
//     });
//
//     // Play the Prince character this turn (making it wet)
//     Await testEngine.playCard(beastFrustratedDesigner);
//
//     // Verify the character is wet (played this turn)
//     Const prince = testEngine.getCardModel(beastFrustratedDesigner);
//     Expect(prince.isWet).toBe(true);
//     Expect(prince.ready).toBe(true); // Should still be ready
//
//     // Activate The Glass Slipper using the wet Prince character
//     Await testEngine.activateCard(theGlassSlipper, {
//       Costs: [beastFrustratedDesigner],
//     });
//
//     // Verify costs were paid
//     Expect(testEngine.getCardModel(theGlassSlipper).zone).toEqual("discard");
//     Expect(testEngine.getCardModel(beastFrustratedDesigner).exerted).toEqual(
//       True,
//     );
//
//     // Resolve the ability
//     Await testEngine.resolveTopOfStack({ targets: [mulanImperialGeneral] });
//     Expect(testEngine.getCardModel(mulanImperialGeneral).zone).toEqual("hand");
//   });
// });
//
