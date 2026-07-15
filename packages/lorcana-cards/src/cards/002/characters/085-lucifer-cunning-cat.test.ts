// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LuciferCunningCat,
//   PainUnderworldImp,
//   PanicUnderworldImp,
//   PeteBadGuy,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { NnPuppies } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lucifer - Cunning Cat", () => {
//   Describe("**MOUSE CATCHER** When you play this character, each opponent chooses and discards either 2 cards or 1 action card.", () => {
//     It("Discard action card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: luciferCunningCat.cost,
//           Hand: [luciferCunningCat],
//         },
//         {
//           Hand: [panicUnderworldImp, painUnderworldImp, peteBadGuy, NnPuppies],
//         },
//       );
//
//       Await testEngine.playCard(luciferCunningCat);
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ targets: [NnPuppies] });
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(testEngine.getCardModel(NnPuppies).zone).toEqual("discard");
//       Expect(testEngine.store.priorityPlayer).toEqual("player_one");
//     });
//
//     It("Discard a NON-action card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: luciferCunningCat.cost,
//           Hand: [luciferCunningCat],
//         },
//         {
//           Hand: [panicUnderworldImp, painUnderworldImp, peteBadGuy, NnPuppies],
//         },
//       );
//
//       Await testEngine.playCard(luciferCunningCat);
//       Expect(testEngine.store.priorityPlayer).toEqual("player_two");
//       TestEngine.changeActivePlayer("player_two");
//
//       Await testEngine.resolveTopOfStack(
//         { targets: [painUnderworldImp] },
//         True,
//       );
//       Expect(testEngine.stackLayers).toHaveLength(1);
//       Expect(testEngine.store.priorityPlayer).toEqual("player_two");
//       Expect(testEngine.getCardModel(painUnderworldImp).zone).toEqual(
//         "discard",
//       );
//
//       Await testEngine.resolveTopOfStack({ targets: [panicUnderworldImp] });
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(testEngine.store.priorityPlayer).toEqual("player_one");
//       Expect(testEngine.getCardModel(panicUnderworldImp).zone).toEqual(
//         "discard",
//       );
//     });
//   });
// });
//
