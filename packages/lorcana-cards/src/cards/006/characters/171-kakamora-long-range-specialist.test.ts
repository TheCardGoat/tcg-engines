// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   kakamoraLongrangeSpecialist,
//   mrSmeeSteadfastMate,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { mickeyMouseDetective } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { galacticCouncilChamber } from "../locations/204-galactic-council-chamber";
//
// describe("Kakamora - Long-Range Specialist", () => {
//   it("A LITTLE HELP - deals 1 damage to chosen character when another Pirate is in play", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: kakamoraLongrangeSpecialist.cost,
//         play: [mrSmeeSteadfastMate],
//         hand: [kakamoraLongrangeSpecialist],
//       },
//       {
//         play: [mickeyMouseDetective],
//       },
//     );
//
//     const targetCharacter = testEngine.getCardModel(mickeyMouseDetective);
//
//     await testEngine.playCard(kakamoraLongrangeSpecialist);
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({
//       targets: [targetCharacter],
//     });
//
//     expect(targetCharacter.damage).toBe(1);
//   });
//
//   it("A LITTLE HELP - deals 1 damage to chosen location when another Pirate is in play", async () => {
//     const testEngine = new TestEngine({
//       inkwell: kakamoraLongrangeSpecialist.cost,
//       play: [mrSmeeSteadfastMate, galacticCouncilChamber],
//       hand: [kakamoraLongrangeSpecialist],
//     });
//
//     const targetLocation = testEngine.getCardModel(galacticCouncilChamber);
//
//     await testEngine.playCard(kakamoraLongrangeSpecialist);
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({
//       targets: [targetLocation],
//     });
//
//     expect(targetLocation.damage).toBe(1);
//   });
//
//   it("A LITTLE HELP - does not trigger when no other Pirate is in play", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: kakamoraLongrangeSpecialist.cost,
//         hand: [kakamoraLongrangeSpecialist],
//       },
//       {
//         play: [mickeyMouseDetective],
//       },
//     );
//
//     const targetCharacter = testEngine.getCardModel(mickeyMouseDetective);
//
//     await testEngine.playCard(kakamoraLongrangeSpecialist);
//
//     expect(testEngine.stackLayers).toHaveLength(0);
//     expect(targetCharacter.damage).toBe(0);
//   });
// });
//
