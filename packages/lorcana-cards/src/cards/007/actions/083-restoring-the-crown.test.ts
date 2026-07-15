// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   EdgarBalthazarAmbitiousButler,
//   MadHatterUnrulyEccentric,
//   PetePirateScoundrel,
//   RestoringTheCrown,
//   ScroogeMcduckResourcefulMiser,
//   YokaiIntellectualSchemer,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Restoring The Crown", () => {
//   It("Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: restoringTheCrown.cost,
//         Hand: [restoringTheCrown],
//         Play: [edgarBalthazarAmbitiousButler, scroogeMcduckResourcefulMiser],
//       },
//       {
//         Play: [
//           PetePirateScoundrel,
//           MadHatterUnrulyEccentric,
//           YokaiIntellectualSchemer,
//         ],
//       },
//     );
//
//     Await testEngine.playCard(restoringTheCrown);
//
//     [
//       PetePirateScoundrel,
//       MadHatterUnrulyEccentric,
//       YokaiIntellectualSchemer,
//     ].forEach((character) => {
//       Expect(testEngine.getCardModel(character).exerted).toBe(true);
//     });
//
//     Await testEngine.challenge({
//       Attacker: edgarBalthazarAmbitiousButler,
//       Defender: petePirateScoundrel,
//     });
//
//     Expect(testEngine.getLoreForPlayer()).toBe(2);
//
//     Await testEngine.challenge({
//       Attacker: scroogeMcduckResourcefulMiser,
//       Defender: yokaiIntellectualSchemer,
//     });
//
//     Expect(testEngine.getLoreForPlayer()).toBe(4);
//   });
// });
//
