// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { peterPansShadowNotSewnOn } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { peteBornToCheat } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { blastFromYourPast } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { petePastryChomper } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Blast From Your Past", () => {
//   it("Name a card. Return all character cards with that name from your discard to your hand.", () => {
//     const testStore = new TestStore({
//       inkwell: blastFromYourPast.cost,
//       hand: [blastFromYourPast],
//       discard: [petePastryChomper, peteBornToCheat, peterPansShadowNotSewnOn],
//     });
//
//     const cardUnderTest = testStore.getCard(blastFromYourPast);
//     const targetOne = testStore.getCard(petePastryChomper);
//     const targetTwo = testStore.getCard(peteBornToCheat);
//     const targetThree = testStore.getCard(peterPansShadowNotSewnOn);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ nameACard: "Pete" });
//
//     expect(targetOne.zone).toBe("hand");
//     expect(targetTwo.zone).toBe("hand");
//     expect(targetThree.zone).toBe("discard");
//   });
// });
//
