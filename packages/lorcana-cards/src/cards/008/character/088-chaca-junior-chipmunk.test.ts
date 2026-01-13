// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import {
//   chacaJuniorChipmunk,
//   deweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Chaca - Junior Chipmunk", () => {
//   it("IN CAHOOTS When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: chacaJuniorChipmunk.cost,
//         hand: [chacaJuniorChipmunk],
//         play: [tipoGrowingSon],
//       },
//       {
//         play: [deweyLovableShowoff],
//       },
//     );
//
//     const targetReckless = testEngine.getCardModel(deweyLovableShowoff);
//
//     await testEngine.playCard(chacaJuniorChipmunk);
//
//     await testEngine.resolveTopOfStack({ targets: [targetReckless] });
//
//     expect(targetReckless.hasReckless).toBe(false);
//
//     await testEngine.passTurn();
//
//     expect(targetReckless.hasReckless).toBe(true);
//   });
// });
//
