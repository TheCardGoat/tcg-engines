// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   DeweyLovableShowoff,
//   ForestDuel,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Forest Duel", () => {
//   It("Your characters gain Challenger +2 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +2 {S} while challenging.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: forestDuel.cost,
//         Play: [deweyLovableShowoff],
//         Hand: [forestDuel],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Await testEngine.playCard(forestDuel);
//
//     Expect(testEngine.getCardModel(deweyLovableShowoff).hasChallenger).toEqual(
//       True,
//     );
//
//     Await testEngine.challenge({
//       Attacker: deweyLovableShowoff,
//       Defender: goofyKnightForADay,
//       ExertDefender: true,
//     });
//
//     Expect(testEngine.getCardModel(deweyLovableShowoff).zone).toEqual("hand");
//   });
// });
//
