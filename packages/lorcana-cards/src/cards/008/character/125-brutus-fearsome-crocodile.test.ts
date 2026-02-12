// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { madamMimFox } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   BrutusFearsomeCrocodile,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Brutus - Fearsome Crocodile", () => {
//   It("SPITEFUL During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: brutusFearsomeCrocodile.cost,
//         Play: [brutusFearsomeCrocodile, deweyLovableShowoff],
//       },
//       {
//         Play: [madamMimFox],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(brutusFearsomeCrocodile);
//     Const otherCard = testEngine.getCardModel(deweyLovableShowoff);
//     Const target = testEngine.getCardModel(madamMimFox);
//
//     Target.exert();
//
//     Await testEngine.challenge({
//       Attacker: cardUnderTest,
//       Defender: target,
//     });
//
//     TestEngine.setCardDamage(otherCard, 1);
//
//     Expect(testEngine.getPlayerLore()).toEqual(2);
//   });
// });
//
