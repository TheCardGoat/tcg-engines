// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { elsaQueenRegent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { annaMagicalMission } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Anna - Magical Mission", () => {
//   It.skip("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [annaMagicalMission],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(annaMagicalMission);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [annaMagicalMission],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(annaMagicalMission);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   It("COORDINATED PLAN Whenever this character quests, if you have a character named Elsa in play, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: annaMagicalMission.cost,
//       Play: [annaMagicalMission, elsaQueenRegent],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(annaMagicalMission);
//
//     Await testEngine.questCard(cardUnderTest);
//     TestEngine.resolveOptionalAbility(true);
//     TestEngine.resolveOptionalAbility(true);
//     TestEngine.resolveOptionalAbility(true);
//
//     Expect(testEngine.getCardsByZone("hand").length).toEqual(1);
//   });
// });
//
