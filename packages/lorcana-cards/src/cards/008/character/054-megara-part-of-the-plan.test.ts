// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HadesRuthlessTyrant,
//   MegaraPartOfThePlan,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Megara - Part of the Plan", () => {
//   It("CONTENTIOUS ALLIANCE While you have a character named Hades in play, this character gains Challenger +2. (They get +2 {S} while challenging.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hadesRuthlessTyrant.cost,
//       Play: [megaraPartOfThePlan],
//       Hand: [hadesRuthlessTyrant],
//     });
//
//     Expect(testEngine.getCardModel(megaraPartOfThePlan).hasChallenger).toBe(
//       False,
//     );
//     Await testEngine.playCard(hadesRuthlessTyrant);
//     Expect(testEngine.getCardModel(megaraPartOfThePlan).hasChallenger).toBe(
//       True,
//     );
//   });
// });
//
