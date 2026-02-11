// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   GeneNicelandResident,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gene - Niceland Resident", () => {
//   It("I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [geneNicelandResident, deweyLovableShowoff],
//     });
//
//     Const cardToTest = testEngine.getCardModel(geneNicelandResident);
//     Const cardTarget = testEngine.getCardModel(deweyLovableShowoff);
//     CardTarget.damage = 2;
//
//     Await cardToTest.quest();
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//     Expect(cardTarget.damage).toEqual(0);
//   });
// });
//
