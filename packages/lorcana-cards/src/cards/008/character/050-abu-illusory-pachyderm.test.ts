// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   abuIllusoryPachyderm,
//   boltDownButNotOut,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Abu - Illusory Pachyderm", () => {
//   it("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
//     const testEngine = new TestEngine({
//       play: [abuIllusoryPachyderm],
//     });
//
//     expect(testEngine.getCardModel(abuIllusoryPachyderm).hasVanish).toBe(true);
//   });
//
//   it("GRASPING TRUNK Whenever this character quests, gain lore equal to the {L} of chosen opposing character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [abuIllusoryPachyderm],
//       },
//       {
//         play: [boltDownButNotOut],
//       },
//     );
//
//     await testEngine.questCard(abuIllusoryPachyderm);
//     expect(testEngine.getPlayerLore()).toBe(abuIllusoryPachyderm.lore);
//
//     await testEngine.resolveTopOfStack({ targets: [boltDownButNotOut] });
//     expect(testEngine.getPlayerLore()).toBe(
//       boltDownButNotOut.lore + abuIllusoryPachyderm.lore,
//     );
//   });
// });
//
