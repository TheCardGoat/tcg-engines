// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   deweyLovableShowoff,
//   geneNicelandResident,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Gene - Niceland Resident", () => {
//   it("I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.", async () => {
//     const testEngine = new TestEngine({
//       play: [geneNicelandResident, deweyLovableShowoff],
//     });
//
//     const cardToTest = testEngine.getCardModel(geneNicelandResident);
//     const cardTarget = testEngine.getCardModel(deweyLovableShowoff);
//     cardTarget.damage = 2;
//
//     await cardToTest.quest();
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//     expect(cardTarget.damage).toEqual(0);
//   });
// });
//
