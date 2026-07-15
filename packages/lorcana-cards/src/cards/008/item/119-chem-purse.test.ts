// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BrunoMadrigalSingingSeer,
//   BrunoMadrigalSingleminded,
//   ChemPurse,
//   JumbaJookibaCriticalScientist,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chem Purse", () => {
//   It("HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell:
//         BrunoMadrigalSingingSeer.cost + jumbaJookibaCriticalScientist.cost,
//       Play: [chemPurse, brunoMadrigalSingleminded],
//       Hand: [brunoMadrigalSingingSeer, jumbaJookibaCriticalScientist],
//     });
//
//     Await testEngine.shiftCard({
//       Shifter: brunoMadrigalSingingSeer,
//       Shifted: brunoMadrigalSingleminded,
//     });
//
//     Expect(testEngine.getCardModel(brunoMadrigalSingingSeer).strength).toBe(
//       BrunoMadrigalSingleminded.strength + 4,
//     );
//
//     Await testEngine.playCard(jumbaJookibaCriticalScientist);
//     Expect(
//       TestEngine.getCardModel(jumbaJookibaCriticalScientist).strength,
//     ).toBe(jumbaJookibaCriticalScientist.strength);
//   });
// });
//
