// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   BeagleBoysSmalltimeCrooks,
//   MiloThatchUndauntedScholar,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Milo Thatch - Undaunted Scholar", () => {
//   It("I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: miloThatchUndauntedScholar.cost,
//       Play: [miloThatchUndauntedScholar, beagleBoysSmalltimeCrooks],
//       Hand: [hakunaMatata],
//     });
//
//     Await testEngine.singSong({
//       Singer: beagleBoysSmalltimeCrooks,
//       Song: hakunaMatata,
//     });
//
//     Console.log(JSON.stringify(testEngine.stackLayers));
//
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({
//       Targets: [beagleBoysSmalltimeCrooks],
//     });
//
//     Expect(testEngine.getCardModel(beagleBoysSmalltimeCrooks).strength).toBe(
//       BeagleBoysSmalltimeCrooks.strength + 2,
//     );
//   });
// });
//
