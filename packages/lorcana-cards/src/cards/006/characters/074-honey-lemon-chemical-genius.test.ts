// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   honeyLemonChemicalGenius,
//   kakamoraPiratePitcher,
//   michaelDarlingPlayfulSwordsman,
//   rayaKumandranRider,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Honey Lemon - Chemical Genius", () => {
//   it("**HERE'S THE BEST PART** When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: honeyLemonChemicalGenius.cost + 2,
//         hand: [kakamoraPiratePitcher, honeyLemonChemicalGenius],
//       },
//       {
//         inkwell: 1,
//         hand: [rayaKumandranRider, michaelDarlingPlayfulSwordsman],
//       },
//     );
//
//     await testEngine.playCard(honeyLemonChemicalGenius);
//
//     await testEngine.resolveOptionalAbility();
//
//     testEngine.changeActivePlayer("player_two");
//     await testEngine.resolveTopOfStack({ targets: [rayaKumandranRider] });
//
//     expect(testEngine.getCardModel(rayaKumandranRider).zone).toEqual("discard");
//     expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
