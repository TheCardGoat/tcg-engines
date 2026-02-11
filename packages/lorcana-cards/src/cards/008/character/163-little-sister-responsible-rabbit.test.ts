// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LittleSisterResponsibleRabbit,
//   RoquefortLockExpert,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Little Sister - Responsible Rabbit", () => {
//   It("LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: littleSisterResponsibleRabbit.cost + roquefortLockExpert.cost,
//       Hand: [littleSisterResponsibleRabbit],
//       Play: [roquefortLockExpert],
//     });
//
//     Const littleSisterCard = testEngine.getCardModel(
//       LittleSisterResponsibleRabbit,
//     );
//     Const roquefortCard = testEngine.getCardModel(roquefortLockExpert);
//
//     RoquefortCard.meta.damage = 1;
//     Expect(roquefortCard.meta.damage).toBe(1);
//
//     Await testEngine.playCard(littleSisterResponsibleRabbit);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [roquefortCard] });
//   });
// });
//
