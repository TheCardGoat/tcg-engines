// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { donaldDuckStruttingHisStuff } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { weCouldBeImmortals } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("We Could Be Immortals", () => {
//   It("_(A character with cost 4 or more can {E} to sing this song for free.)_Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: weCouldBeImmortals.cost,
//       Hand: [weCouldBeImmortals],
//       Play: [donaldDuckStruttingHisStuff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(weCouldBeImmortals);
//     Const inventor = testEngine.getCardModel(donaldDuckStruttingHisStuff);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Expect(inventor.hasResist).toBe(true);
//     Expect(cardUnderTest.zone).toBe("inkwell");
//   });
// });
//
