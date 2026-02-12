// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { peterPansShadowNotSewnOn } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { peteBornToCheat } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { blastFromYourPast } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { petePastryChomper } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Blast From Your Past", () => {
//   It("Name a card. Return all character cards with that name from your discard to your hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: blastFromYourPast.cost,
//       Hand: [blastFromYourPast],
//       Discard: [petePastryChomper, peteBornToCheat, peterPansShadowNotSewnOn],
//     });
//
//     Const cardUnderTest = testStore.getCard(blastFromYourPast);
//     Const targetOne = testStore.getCard(petePastryChomper);
//     Const targetTwo = testStore.getCard(peteBornToCheat);
//     Const targetThree = testStore.getCard(peterPansShadowNotSewnOn);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ nameACard: "Pete" });
//
//     Expect(targetOne.zone).toBe("hand");
//     Expect(targetTwo.zone).toBe("hand");
//     Expect(targetThree.zone).toBe("discard");
//   });
// });
//
