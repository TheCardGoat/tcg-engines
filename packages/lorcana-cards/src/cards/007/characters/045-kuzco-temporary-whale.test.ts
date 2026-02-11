// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { kuzcoTemporaryWhale } from "@lorcanito/lorcana-engine/cards/007/index";
// Import {
//   CharlotteLaBouffMardiGrasPrincess,
//   DeweyLovableShowoff,
//   TianaNaturalTalent,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kuzco - Temporary Whale", () => {
//   It("DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: kuzcoTemporaryWhale.cost,
//       Play: [kuzcoTemporaryWhale, charlotteLaBouffMardiGrasPrincess],
//       Hand: [deweyLovableShowoff],
//       Deck: [tianaNaturalTalent],
//     });
//
//     // const cardUnderTest = testEngine.getCardModel(kuzcoTemporaryWhale);
//     Const cardToInkwell = testEngine.getCardModel(deweyLovableShowoff);
//     Const cardInDeck = testEngine.getCardModel(tianaNaturalTalent);
//     Const target = testEngine.getCardModel(charlotteLaBouffMardiGrasPrincess);
//
//     Await testEngine.putIntoInkwell(cardToInkwell);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("hand");
//     Expect(cardInDeck.zone).toBe("hand");
//   });
//
//   It("DON'T YOU SAY A WORD Case when the card bounced is of the oppo.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [kuzcoTemporaryWhale],
//         Hand: [deweyLovableShowoff],
//         Deck: 10,
//       },
//       {
//         Play: [charlotteLaBouffMardiGrasPrincess],
//         Deck: 10,
//       },
//     );
//
//     Await testEngine.putIntoInkwell(deweyLovableShowoff);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [charlotteLaBouffMardiGrasPrincess],
//     });
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Hand: 0,
//         Deck: 10,
//         Play: 1,
//       }),
//     );
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Hand: 2,
//         Deck: 9,
//         Play: 0,
//       }),
//     );
//   });
// });
//
