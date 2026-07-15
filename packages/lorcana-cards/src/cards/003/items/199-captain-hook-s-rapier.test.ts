// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { captainHooksRapier } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { captainHookUnderhanded } from "@lorcanito/lorcana-engine/cards/006";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Captain Hook’s Rapier", () => {
//   It("**GET THOSE SCURVY BRATS!** During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.**LET’S HAVE AT IT!</** Your characters named Captain Hook gain **Challenger** +1. _(They get +1 {S} while challenging.)_", () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: captainHooksRapier.cost + 1,
//         Play: [captainHooksRapier, deweyLovableShowoff],
//       },
//       {
//         Play: [captainHookUnderhanded],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(captainHooksRapier);
//     Const attacker = testEngine.getCardModel(deweyLovableShowoff);
//     Const defender = testEngine.getCardModel(captainHookUnderhanded);
//
//     Defender.exert();
//
//     TestEngine.challenge({
//       Attacker: attacker,
//       Defender: defender,
//     });
//
//     Expect(defender.zone).toBe("discard");
//     TestEngine.resolveOptionalAbility();
//     Expect(testEngine.getCardsByZone("hand").length).toBe(1);
//
//     // testEngine.resolveOptionalAbility();
//     // testEngine.resolveTopOfStack({});
//   });
// });
//
