// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { kuzcoTemporaryWhale } from "@lorcanito/lorcana-engine/cards/007/index";
// import {
//   charlotteLaBouffMardiGrasPrincess,
//   deweyLovableShowoff,
//   tianaNaturalTalent,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Kuzco - Temporary Whale", () => {
//   it("DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: kuzcoTemporaryWhale.cost,
//       play: [kuzcoTemporaryWhale, charlotteLaBouffMardiGrasPrincess],
//       hand: [deweyLovableShowoff],
//       deck: [tianaNaturalTalent],
//     });
//
//     // const cardUnderTest = testEngine.getCardModel(kuzcoTemporaryWhale);
//     const cardToInkwell = testEngine.getCardModel(deweyLovableShowoff);
//     const cardInDeck = testEngine.getCardModel(tianaNaturalTalent);
//     const target = testEngine.getCardModel(charlotteLaBouffMardiGrasPrincess);
//
//     await testEngine.putIntoInkwell(cardToInkwell);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toBe("hand");
//     expect(cardInDeck.zone).toBe("hand");
//   });
//
//   it("DON'T YOU SAY A WORD Case when the card bounced is of the oppo.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [kuzcoTemporaryWhale],
//         hand: [deweyLovableShowoff],
//         deck: 10,
//       },
//       {
//         play: [charlotteLaBouffMardiGrasPrincess],
//         deck: 10,
//       },
//     );
//
//     await testEngine.putIntoInkwell(deweyLovableShowoff);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({
//       targets: [charlotteLaBouffMardiGrasPrincess],
//     });
//
//     expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       expect.objectContaining({
//         hand: 0,
//         deck: 10,
//         play: 1,
//       }),
//     );
//     expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       expect.objectContaining({
//         hand: 2,
//         deck: 9,
//         play: 0,
//       }),
//     );
//   });
// });
//
