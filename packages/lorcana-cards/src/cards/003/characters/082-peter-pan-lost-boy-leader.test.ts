// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { peterPanLostBoyLeader } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   ForbiddenMountainMaleficentsCastle,
//   NeverLandMermaidLagoon,
// } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Peter Pan - Lost Boy Leader", () => {
//   It("**I CAME TO LISTEN TO THE STORIES** Once per turn, when this character moves to a location, gain lore equal to that location's {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell:
//         ForbiddenMountainMaleficentsCastle.moveCost +
//         NeverLandMermaidLagoon.moveCost,
//       Play: [
//         PeterPanLostBoyLeader,
//         ForbiddenMountainMaleficentsCastle,
//         NeverLandMermaidLagoon,
//       ],
//     });
//
//     Await testEngine.moveToLocation({
//       Character: peterPanLostBoyLeader,
//       Location: forbiddenMountainMaleficentsCastle,
//     });
//
//     Expect(testEngine.getPlayerLore()).toBe(
//       ForbiddenMountainMaleficentsCastle.lore,
//     );
//
//     Await testEngine.moveToLocation({
//       Character: peterPanLostBoyLeader,
//       Location: neverLandMermaidLagoon,
//     });
//
//     Expect(testEngine.getPlayerLore()).toBe(
//       ForbiddenMountainMaleficentsCastle.lore,
//     );
//   });
// });
//
