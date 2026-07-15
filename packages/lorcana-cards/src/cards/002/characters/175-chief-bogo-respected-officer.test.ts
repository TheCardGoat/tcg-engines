// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   ChiefBogoRespectedOfficer,
//   HerculesDivineHero,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Chief Bogo- Respected Officer", () => {
//   It("**INSUBORDINATION!** Whenever you play a Floodborn character, deal 1 damage to each opposing character.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: herculesDivineHero.cost,
//         Hand: [herculesDivineHero],
//         Play: [chiefBogoRespectedOfficer],
//       },
//       {
//         Play: [liloGalacticHero],
//       },
//     );
//
//     Const floodbornChar = testStore.getByZoneAndId(
//       "hand",
//       HerculesDivineHero.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       LiloGalacticHero.id,
//       "player_two",
//     );
//
//     FloodbornChar.playFromHand();
//
//     Expect(target.damage).toEqual(1);
//   });
// });
//
// Describe("Regression tests", () => {
//   It("Doesn't trigger opponent's bogo abilitiy when playing a floodborn", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: herculesDivineHero.cost,
//         Hand: [herculesDivineHero],
//         Play: [chiefBogoRespectedOfficer],
//       },
//       {
//         Play: [liloGalacticHero, chiefBogoRespectedOfficer],
//       },
//     );
//
//     Const floodbornChar = testStore.getByZoneAndId(
//       "hand",
//       HerculesDivineHero.id,
//     );
//     Const target = testStore.getCard(liloGalacticHero);
//     Const opponentBogo = testStore.getByZoneAndId(
//       "play",
//       ChiefBogoRespectedOfficer.id,
//       "player_two",
//     );
//
//     FloodbornChar.playFromHand();
//
//     Expect(target.damage).toEqual(1);
//     Expect(opponentBogo.damage).toEqual(1);
//   });
// });
//
