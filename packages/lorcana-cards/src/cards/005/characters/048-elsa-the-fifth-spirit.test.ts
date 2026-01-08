// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   elsaTheFifthSpirit,
//   monstroWhaleOfAWhale,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Elsa The Fifth Spirit", () => {
//   it("**CRYSTALLIZE** When you play this character, exert chosen opposing character.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: elsaTheFifthSpirit.cost,
//         hand: [elsaTheFifthSpirit],
//       },
//       {
//         play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       elsaTheFifthSpirit.id,
//     );
//     const target = testStore.getCard(monstroWhaleOfAWhale);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//     expect(target.meta.exerted).toBe(true);
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
