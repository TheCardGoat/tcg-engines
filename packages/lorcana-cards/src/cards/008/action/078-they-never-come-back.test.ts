// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GeneralLiHeadOfTheImperialArmy,
//   JumbaJookibaCriticalScientist,
//   TheyNeverComeBack,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("They Never Come Back", () => {
//   It("Up to 2 chosen characters can’t ready at the start of their next turn. Draw a card.", async () => {
//     Const targets = [
//       JumbaJookibaCriticalScientist,
//       GeneralLiHeadOfTheImperialArmy,
//     ];
//
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: theyNeverComeBack.cost,
//         Hand: [theyNeverComeBack],
//         Deck: 10,
//       },
//       {
//         Play: targets,
//       },
//     );
//
//     For (const target of targets) {
//       Await testEngine.tapCard(target);
//     }
//
//     Await testEngine.playCard(theyNeverComeBack, {
//       Targets: targets,
//     });
//
//     For (const target of targets) {
//       Expect(testEngine.getCardModel(target).exerted).toBe(true);
//     }
//   });
// });
//
