// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { simbaProtectiveCub } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   JoeyBluePigeon,
//   MontereyJackDefiantProtector,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Joey - Blue Pigeon", () => {
//   It("I'VE GOT JUST THE THING Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [joeyBluePigeon, simbaProtectiveCub, montereyJackDefiantProtector],
//     });
//
//     Const cardToTest = testEngine.getCardModel(joeyBluePigeon);
//     Const otheBodyguard1 = testEngine.getCardModel(simbaProtectiveCub);
//     Const otheBodyguard2 = testEngine.getCardModel(
//       MontereyJackDefiantProtector,
//     );
//
//     OtheBodyguard1.damage = 2;
//     OtheBodyguard2.damage = 2;
//     CardToTest.damage = 1;
//
//     Await cardToTest.quest();
//
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(cardToTest.damage).toEqual(1);
//     Expect(otheBodyguard1.damage).toEqual(1);
//     Expect(otheBodyguard2.damage).toEqual(1);
//
//     // await testEngine.resolveTopOfStack({});
//   });
// });
//
