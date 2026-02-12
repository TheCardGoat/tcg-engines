// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   MrSmeeSteadfastMate,
//   MullinsSeasonedShipmate,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mullins - Seasoned Shipmate", () => {
//   It("FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
//     // Test when Mr. Smee is not in play
//     Const testEngine = new TestEngine({
//       Play: [mullinsSeasonedShipmate],
//     });
//
//     Const mullins = testEngine.getCardModel(mullinsSeasonedShipmate);
//     Expect(mullins.hasResist).toBe(false);
//
//     // Add Mr. Smee to play and verify Mullins gains Resist +1
//     Const testEngineWithSmee = new TestEngine({
//       Play: [mullinsSeasonedShipmate, mrSmeeSteadfastMate],
//     });
//
//     Const mullinsWithSmee = testEngineWithSmee.getCardModel(
//       MullinsSeasonedShipmate,
//     );
//     Expect(mullinsWithSmee.hasResist).toBe(true);
//
//     // Test damage reduction when Mullins has Resist
//     Const testEngineWithDamage = new TestEngine(
//       {
//         Play: [mullinsSeasonedShipmate, mrSmeeSteadfastMate],
//       },
//       {
//         Play: [goonsMaleficent],
//       },
//     );
//
//     Const mullinsWithResist = testEngineWithDamage.getCardModel(
//       MullinsSeasonedShipmate,
//     );
//     MullinsWithResist.updateCardMeta({ exerted: true });
//
//     Const attacker = testEngineWithDamage.getCardModel(goonsMaleficent);
//     Attacker.challenge(mullinsWithResist);
//     Expect(mullinsWithResist.damage).toBe(goonsMaleficent.strength - 1);
//   });
//
//   It("FALL IN LINE ability is dynamic and updates when Mr. Smee enters or leaves play", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mrSmeeSteadfastMate.cost + dragonFire.cost,
//         Play: [mullinsSeasonedShipmate],
//         Hand: [mrSmeeSteadfastMate, dragonFire],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Const mullins = testEngine.getCardModel(mullinsSeasonedShipmate);
//     Expect(mullins.hasResist).toBe(false);
//
//     Await testEngine.playCard(mrSmeeSteadfastMate);
//     Expect(mullins.hasResist).toBe(true);
//
//     Await testEngine.playCard(dragonFire, {
//       Targets: [mrSmeeSteadfastMate],
//     });
//
//     Expect(mullins.hasResist).toBe(false);
//   });
// });
//
