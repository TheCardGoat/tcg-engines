// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { tadashiHamadaGiftedRoboticist } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tadashi Hamada - Gifted Roboticist", () => {
//   It.skip("SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: tadashiHamadaGiftedRoboticist.cost,
//       Play: [tadashiHamadaGiftedRoboticist],
//       Hand: [tadashiHamadaGiftedRoboticist],
//     });
//
//     Await testEngine.playCard(tadashiHamadaGiftedRoboticist);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
