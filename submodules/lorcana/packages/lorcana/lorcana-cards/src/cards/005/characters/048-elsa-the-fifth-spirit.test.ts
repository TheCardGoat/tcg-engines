// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ElsaTheFifthSpirit,
//   MonstroWhaleOfAWhale,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Elsa The Fifth Spirit", () => {
//   It("**CRYSTALLIZE** When you play this character, exert chosen opposing character.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: elsaTheFifthSpirit.cost,
//         Hand: [elsaTheFifthSpirit],
//       },
//       {
//         Play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       ElsaTheFifthSpirit.id,
//     );
//     Const target = testStore.getCard(monstroWhaleOfAWhale);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(target.meta.exerted).toBe(true);
//   });
// });
//
// // describe("Regression", () => {
// //   it("Should not lock people when Elsa The Fifth Spirit is played without a valid target", async () => {
// //     const testEngine = new TestEngine(
// //       {
// //         inkwell: elsaTheFifthSpirit.cost,
// //         hand: [elsaTheFifthSpirit],
// //       },
// //       {
// //         play: [princeJohnGreediestOfAll, diabloDevotedHerald],
// //       },
// //     );
// //
// //     await testEngine.tapCard(diabloDevotedHerald);
// //     await testEngine.playCard(elsaTheFifthSpirit);
// //
// //     await testEngine.resolveTopOfStack({ targets: [diabloDevotedHerald] });
// //   });
// // });
//
