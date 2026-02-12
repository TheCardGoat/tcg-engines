// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielOnHumanLegs,
//   ArielSpectacularSinger,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { hadesFastTalker } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hades - Fast Talker", () => {
//   Describe("FOR JUST A LITTLE PAIN", () => {
//     It("should banish a character with cost 3 or less when you deal damage to your own character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: hadesFastTalker.cost,
//           Hand: [hadesFastTalker],
//           Play: [arielOnHumanLegs],
//         },
//         {
//           Play: [mickeyMouseTrueFriend, arielSpectacularSinger],
//         },
//       );
//
//       Await testEngine.playCard(hadesFastTalker);
//       Await testEngine.resolveOptionalAbility(true);
//       Await testEngine.resolveTopOfStack({ targets: [arielOnHumanLegs] }, true);
//       Await testEngine.resolveTopOfStack({ targets: [arielSpectacularSinger] });
//
//       Expect(testEngine.getCardsByZone("play", "player_one")).toHaveLength(2);
//       Expect(testEngine.getCardsByZone("discard", "player_two")).toHaveLength(
//         1,
//       );
//       Expect(testEngine.getCardModel(arielOnHumanLegs).damage).toBe(2);
//     });
//
//     It("should banish own character with cost 3 or less if it's the only valid target", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: hadesFastTalker.cost,
//           Hand: [hadesFastTalker],
//           Play: [mickeyMouseTrueFriend],
//         },
//         {
//           Play: [arielOnHumanLegs],
//         },
//       );
//
//       Await testEngine.playCard(hadesFastTalker);
//       Await testEngine.resolveOptionalAbility(true);
//       Await testEngine.resolveTopOfStack(
//         { targets: [mickeyMouseTrueFriend] },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({ targets: [arielOnHumanLegs] }, true);
//       Await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//
//       Expect(testEngine.getCardsByZone("play", "player_one")).toHaveLength(1);
//       Expect(testEngine.getCardsByZone("discard", "player_two")).toHaveLength(
//         0,
//       );
//       Expect(testEngine.getCardsByZone("discard", "player_one")).toHaveLength(
//         1,
//       );
//     });
//   });
// });
//
