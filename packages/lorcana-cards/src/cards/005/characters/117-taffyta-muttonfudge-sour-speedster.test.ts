// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { taffytaMuttonfudgeSourSpeedster } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Taffyta Muttonfudge - Sour Speedster", () => {
//   It("**NEW ROSTER** Once per turn, when this character moves to a location, gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hiddenCoveTranquilHaven.moveCost * 2,
//       Play: [hiddenCoveTranquilHaven, taffytaMuttonfudgeSourSpeedster],
//     });
//
//     Await testEngine.moveToLocation({
//       Location: hiddenCoveTranquilHaven,
//       Character: taffytaMuttonfudgeSourSpeedster,
//     });
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
// });
//
