// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KakamoraLongrangeSpecialist,
//   MrSmeeSteadfastMate,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { mickeyMouseDetective } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { galacticCouncilChamber } from "../locations/204-galactic-council-chamber";
//
// Describe("Kakamora - Long-Range Specialist", () => {
//   It("A LITTLE HELP - deals 1 damage to chosen character when another Pirate is in play", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: kakamoraLongrangeSpecialist.cost,
//         Play: [mrSmeeSteadfastMate],
//         Hand: [kakamoraLongrangeSpecialist],
//       },
//       {
//         Play: [mickeyMouseDetective],
//       },
//     );
//
//     Const targetCharacter = testEngine.getCardModel(mickeyMouseDetective);
//
//     Await testEngine.playCard(kakamoraLongrangeSpecialist);
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [targetCharacter],
//     });
//
//     Expect(targetCharacter.damage).toBe(1);
//   });
//
//   It("A LITTLE HELP - deals 1 damage to chosen location when another Pirate is in play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: kakamoraLongrangeSpecialist.cost,
//       Play: [mrSmeeSteadfastMate, galacticCouncilChamber],
//       Hand: [kakamoraLongrangeSpecialist],
//     });
//
//     Const targetLocation = testEngine.getCardModel(galacticCouncilChamber);
//
//     Await testEngine.playCard(kakamoraLongrangeSpecialist);
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [targetLocation],
//     });
//
//     Expect(targetLocation.damage).toBe(1);
//   });
//
//   It("A LITTLE HELP - does not trigger when no other Pirate is in play", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: kakamoraLongrangeSpecialist.cost,
//         Hand: [kakamoraLongrangeSpecialist],
//       },
//       {
//         Play: [mickeyMouseDetective],
//       },
//     );
//
//     Const targetCharacter = testEngine.getCardModel(mickeyMouseDetective);
//
//     Await testEngine.playCard(kakamoraLongrangeSpecialist);
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(targetCharacter.damage).toBe(0);
//   });
// });
//
