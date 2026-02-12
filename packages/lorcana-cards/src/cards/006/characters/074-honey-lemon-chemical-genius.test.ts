// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HoneyLemonChemicalGenius,
//   KakamoraPiratePitcher,
//   MichaelDarlingPlayfulSwordsman,
//   RayaKumandranRider,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Honey Lemon - Chemical Genius", () => {
//   It("**HERE'S THE BEST PART** When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: honeyLemonChemicalGenius.cost + 2,
//         Hand: [kakamoraPiratePitcher, honeyLemonChemicalGenius],
//       },
//       {
//         Inkwell: 1,
//         Hand: [rayaKumandranRider, michaelDarlingPlayfulSwordsman],
//       },
//     );
//
//     Await testEngine.playCard(honeyLemonChemicalGenius);
//
//     Await testEngine.resolveOptionalAbility();
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveTopOfStack({ targets: [rayaKumandranRider] });
//
//     Expect(testEngine.getCardModel(rayaKumandranRider).zone).toEqual("discard");
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
