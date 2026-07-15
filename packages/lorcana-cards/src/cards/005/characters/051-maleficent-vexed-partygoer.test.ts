// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { maleficentVexedPartygoer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import {
//   CharlotteLaBouffMardiGrasPrincess,
//   DeweyLovableShowoff,
// } from "../../008";
//
// Describe("Maleficent - Vexed Partygoer", () => {
//   It("**WHAT AN AWKWARD SITUATION** Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player’s hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: maleficentVexedPartygoer.cost,
//       Play: [maleficentVexedPartygoer, charlotteLaBouffMardiGrasPrincess],
//       Hand: [deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(maleficentVexedPartygoer);
//     Const cardTODiscard = testEngine.getCardModel(deweyLovableShowoff);
//     Const cardToBounce = testEngine.getCardModel(
//       CharlotteLaBouffMardiGrasPrincess,
//     );
//
//     Await testEngine.questCard(cardUnderTest);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [cardTODiscard] }, true);
//     Await testEngine.resolveTopOfStack({ targets: [cardToBounce] });
//
//     Expect(cardTODiscard.zone).toBe("discard");
//     Expect(cardToBounce.zone).toBe("hand");
//   });
// });
//
