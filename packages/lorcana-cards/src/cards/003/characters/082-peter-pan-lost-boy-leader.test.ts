// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { peterPanLostBoyLeader } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import {
//   forbiddenMountainMaleficentsCastle,
//   neverLandMermaidLagoon,
// } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Peter Pan - Lost Boy Leader", () => {
//   it("**I CAME TO LISTEN TO THE STORIES** Once per turn, when this character moves to a location, gain lore equal to that location's {L}.", async () => {
//     const testEngine = new TestEngine({
//       inkwell:
//         forbiddenMountainMaleficentsCastle.moveCost +
//         neverLandMermaidLagoon.moveCost,
//       play: [
//         peterPanLostBoyLeader,
//         forbiddenMountainMaleficentsCastle,
//         neverLandMermaidLagoon,
//       ],
//     });
//
//     await testEngine.moveToLocation({
//       character: peterPanLostBoyLeader,
//       location: forbiddenMountainMaleficentsCastle,
//     });
//
//     expect(testEngine.getPlayerLore()).toBe(
//       forbiddenMountainMaleficentsCastle.lore,
//     );
//
//     await testEngine.moveToLocation({
//       character: peterPanLostBoyLeader,
//       location: neverLandMermaidLagoon,
//     });
//
//     expect(testEngine.getPlayerLore()).toBe(
//       forbiddenMountainMaleficentsCastle.lore,
//     );
//   });
// });
//
