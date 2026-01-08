// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import {
//   beagleBoysSmalltimeCrooks,
//   miloThatchUndauntedScholar,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Milo Thatch - Undaunted Scholar", () => {
//   it("I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: miloThatchUndauntedScholar.cost,
//       play: [miloThatchUndauntedScholar, beagleBoysSmalltimeCrooks],
//       hand: [hakunaMatata],
//     });
//
//     await testEngine.singSong({
//       singer: beagleBoysSmalltimeCrooks,
//       song: hakunaMatata,
//     });
//
//     console.log(JSON.stringify(testEngine.stackLayers));
//
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({
//       targets: [beagleBoysSmalltimeCrooks],
//     });
//
//     expect(testEngine.getCardModel(beagleBoysSmalltimeCrooks).strength).toBe(
//       beagleBoysSmalltimeCrooks.strength + 2,
//     );
//   });
// });
//
