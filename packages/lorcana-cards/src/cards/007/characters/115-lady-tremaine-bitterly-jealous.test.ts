// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { diabloDevotedHerald } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { ladyTremaineBitterlyJealous } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lady Tremaine - Bitterly Jealous", () => {
//   It("THAT'S QUITE ENOUGH {E} – Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [ladyTremaineBitterlyJealous, deweyLovableShowoff],
//       },
//       {
//         Hand: [diabloDevotedHerald],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(ladyTremaineBitterlyJealous);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//     Const targetDiscard = testEngine.getCardModel(diabloDevotedHerald);
//
//     Target.damage = 1; // Ensure the target is damaged
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Targets: [target],
//     });
//
//     Expect(target.zone).toBe("hand");
//     Expect(targetDiscard.zone).toBe("discard");
//   });
// });
//
