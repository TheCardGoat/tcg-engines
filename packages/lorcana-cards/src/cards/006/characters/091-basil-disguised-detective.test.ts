// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BasilDisguisedDetective,
//   KakamoraPiratePitcher,
//   MichaelDarlingPlayfulSwordsman,
//   RayaKumandranRider,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Basil - Disguised Detective", () => {
//   It("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Basil.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [basilDisguisedDetective],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(basilDisguisedDetective);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("TWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 1,
//         Play: [basilDisguisedDetective],
//         Hand: [kakamoraPiratePitcher],
//       },
//       {
//         Inkwell: 1,
//         Hand: [rayaKumandranRider, michaelDarlingPlayfulSwordsman],
//       },
//     );
//
//     Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(1);
//     Await testEngine.putIntoInkwell(kakamoraPiratePitcher);
//     Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(2);
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     TestEngine.changeActivePlayer("player_one");
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
