// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   luciferCunningCat,
//   painUnderworldImp,
//   panicUnderworldImp,
//   peteBadGuy,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { NnPuppies } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lucifer - Cunning Cat", () => {
//   describe("**MOUSE CATCHER** When you play this character, each opponent chooses and discards either 2 cards or 1 action card.", () => {
//     it("Discard action card", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: luciferCunningCat.cost,
//           hand: [luciferCunningCat],
//         },
//         {
//           hand: [panicUnderworldImp, painUnderworldImp, peteBadGuy, NnPuppies],
//         },
//       );
//
//       await testEngine.playCard(luciferCunningCat);
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.resolveTopOfStack({ targets: [NnPuppies] });
//
//       expect(testEngine.stackLayers).toHaveLength(0);
//       expect(testEngine.getCardModel(NnPuppies).zone).toEqual("discard");
//       expect(testEngine.store.priorityPlayer).toEqual("player_one");
//     });
//
//     it("Discard a NON-action card", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: luciferCunningCat.cost,
//           hand: [luciferCunningCat],
//         },
//         {
//           hand: [panicUnderworldImp, painUnderworldImp, peteBadGuy, NnPuppies],
//         },
//       );
//
//       await testEngine.playCard(luciferCunningCat);
//       expect(testEngine.store.priorityPlayer).toEqual("player_two");
//       testEngine.changeActivePlayer("player_two");
//
//       await testEngine.resolveTopOfStack(
//         { targets: [painUnderworldImp] },
//         true,
//       );
//       expect(testEngine.stackLayers).toHaveLength(1);
//       expect(testEngine.store.priorityPlayer).toEqual("player_two");
//       expect(testEngine.getCardModel(painUnderworldImp).zone).toEqual(
//         "discard",
//       );
//
//       await testEngine.resolveTopOfStack({ targets: [panicUnderworldImp] });
//       expect(testEngine.stackLayers).toHaveLength(0);
//       expect(testEngine.store.priorityPlayer).toEqual("player_one");
//       expect(testEngine.getCardModel(panicUnderworldImp).zone).toEqual(
//         "discard",
//       );
//     });
//   });
// });
//
