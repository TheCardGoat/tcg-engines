// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { johnSilverDangerousFriend } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("John Silver - Dangerous Friend", () => {
//   It.skip("YOU HAVE TO CHART YOUR OWN COURSE Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: johnSilverDangerousFriend.cost,
//       Play: [johnSilverDangerousFriend],
//       Hand: [johnSilverDangerousFriend],
//     });
//
//     Await testEngine.playCard(johnSilverDangerousFriend);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
