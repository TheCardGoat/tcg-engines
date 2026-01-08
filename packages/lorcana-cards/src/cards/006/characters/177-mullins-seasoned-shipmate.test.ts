// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import {
//   mrSmeeSteadfastMate,
//   mullinsSeasonedShipmate,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mullins - Seasoned Shipmate", () => {
//   it("FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
//     // Test when Mr. Smee is not in play
//     const testEngine = new TestEngine({
//       play: [mullinsSeasonedShipmate],
//     });
//
//     const mullins = testEngine.getCardModel(mullinsSeasonedShipmate);
//     expect(mullins.hasResist).toBe(false);
//
//     // Add Mr. Smee to play and verify Mullins gains Resist +1
//     const testEngineWithSmee = new TestEngine({
//       play: [mullinsSeasonedShipmate, mrSmeeSteadfastMate],
//     });
//
//     const mullinsWithSmee = testEngineWithSmee.getCardModel(
//       mullinsSeasonedShipmate,
//     );
//     expect(mullinsWithSmee.hasResist).toBe(true);
//
//     // Test damage reduction when Mullins has Resist
//     const testEngineWithDamage = new TestEngine(
//       {
//         play: [mullinsSeasonedShipmate, mrSmeeSteadfastMate],
//       },
//       {
//         play: [goonsMaleficent],
//       },
//     );
//
//     const mullinsWithResist = testEngineWithDamage.getCardModel(
//       mullinsSeasonedShipmate,
//     );
//     mullinsWithResist.updateCardMeta({ exerted: true });
//
//     const attacker = testEngineWithDamage.getCardModel(goonsMaleficent);
//     attacker.challenge(mullinsWithResist);
//     expect(mullinsWithResist.damage).toBe(goonsMaleficent.strength - 1);
//   });
//
//   it("FALL IN LINE ability is dynamic and updates when Mr. Smee enters or leaves play", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: mrSmeeSteadfastMate.cost + dragonFire.cost,
//         play: [mullinsSeasonedShipmate],
//         hand: [mrSmeeSteadfastMate, dragonFire],
//       },
//       {
//         play: [goofyKnightForADay],
//       },
//     );
//
//     const mullins = testEngine.getCardModel(mullinsSeasonedShipmate);
//     expect(mullins.hasResist).toBe(false);
//
//     await testEngine.playCard(mrSmeeSteadfastMate);
//     expect(mullins.hasResist).toBe(true);
//
//     await testEngine.playCard(dragonFire, {
//       targets: [mrSmeeSteadfastMate],
//     });
//
//     expect(mullins.hasResist).toBe(false);
//   });
// });
//
