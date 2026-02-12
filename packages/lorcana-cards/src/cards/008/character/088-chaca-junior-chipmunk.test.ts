// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   ChacaJuniorChipmunk,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chaca - Junior Chipmunk", () => {
//   It("IN CAHOOTS When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: chacaJuniorChipmunk.cost,
//         Hand: [chacaJuniorChipmunk],
//         Play: [tipoGrowingSon],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const targetReckless = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.playCard(chacaJuniorChipmunk);
//
//     Await testEngine.resolveTopOfStack({ targets: [targetReckless] });
//
//     Expect(targetReckless.hasReckless).toBe(false);
//
//     Await testEngine.passTurn();
//
//     Expect(targetReckless.hasReckless).toBe(true);
//   });
// });
//
