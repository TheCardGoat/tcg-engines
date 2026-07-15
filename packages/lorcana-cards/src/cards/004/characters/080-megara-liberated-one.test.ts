// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { herculesHeroInTraining } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { megaraLiberatedOne } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Megara - Liberated One", () => {
//   It("**PEOPLE ALWAYS DO CRAZY THINGS** Whenever you play a character named Hercules, you may ready this character.", () => {
//     Const testEngine = new TestEngine({
//       Inkwell: herculesHeroInTraining.cost,
//       Hand: [herculesHeroInTraining],
//       Play: [megaraLiberatedOne],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(megaraLiberatedOne);
//     Const trigger = testEngine.getCardModel(herculesHeroInTraining);
//     CardUnderTest.updateCardMeta({ exerted: true });
//
//     Trigger.playFromHand();
//
//     TestEngine.resolveOptionalAbility();
//     Expect(cardUnderTest.exerted).toEqual(false);
//   });
// });
//
