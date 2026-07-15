// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AbuIllusoryPachyderm,
//   BoltDownButNotOut,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Abu - Illusory Pachyderm", () => {
//   It("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [abuIllusoryPachyderm],
//     });
//
//     Expect(testEngine.getCardModel(abuIllusoryPachyderm).hasVanish).toBe(true);
//   });
//
//   It("GRASPING TRUNK Whenever this character quests, gain lore equal to the {L} of chosen opposing character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [abuIllusoryPachyderm],
//       },
//       {
//         Play: [boltDownButNotOut],
//       },
//     );
//
//     Await testEngine.questCard(abuIllusoryPachyderm);
//     Expect(testEngine.getPlayerLore()).toBe(abuIllusoryPachyderm.lore);
//
//     Await testEngine.resolveTopOfStack({ targets: [boltDownButNotOut] });
//     Expect(testEngine.getPlayerLore()).toBe(
//       BoltDownButNotOut.lore + abuIllusoryPachyderm.lore,
//     );
//   });
// });
//
