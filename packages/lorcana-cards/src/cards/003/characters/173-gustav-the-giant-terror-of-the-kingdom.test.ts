// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   GustavTheGiantTerrorOfTheKingdom,
//   MiloThatchCleverCartographer,
//   StarkeyDeviousPirate,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gustav the Giant - Terror of the Kingdom", () => {
//   It("**ALL TIED UP** This character enters play exerted and can't ready at the start of your turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: gustavTheGiantTerrorOfTheKingdom.cost,
//         Hand: [gustavTheGiantTerrorOfTheKingdom],
//         Deck: 1,
//       },
//       {
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = await testEngine.playCard(
//       GustavTheGiantTerrorOfTheKingdom,
//     );
//
//     Expect(cardUnderTest.exerted).toBe(true);
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Expect(cardUnderTest.exerted).toBe(true);
//   });
//
//   Describe("**BREAK FREE** During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.", () => {
//     It("Banished in a challenge", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [gustavTheGiantTerrorOfTheKingdom, starkeyDeviousPirate],
//         },
//         {
//           Play: [miloThatchCleverCartographer],
//         },
//       );
//
//       Const cardUnderTest = await testEngine.tapCard(
//         GustavTheGiantTerrorOfTheKingdom,
//       );
//       Const defender = await testEngine.tapCard(miloThatchCleverCartographer);
//
//       Await testEngine.challenge({
//         Attacker: starkeyDeviousPirate,
//         Defender: miloThatchCleverCartographer,
//       });
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(defender.zone).toBe("discard");
//       Expect(cardUnderTest.exerted).toBe(false);
//     });
//
//     It("Banished by an action card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: dragonFire.cost,
//           Hand: [dragonFire],
//           Play: [gustavTheGiantTerrorOfTheKingdom],
//         },
//         {
//           Play: [miloThatchCleverCartographer],
//         },
//       );
//
//       Const cardUnderTest = await testEngine.tapCard(
//         GustavTheGiantTerrorOfTheKingdom,
//       );
//
//       Await testEngine.playCard(dragonFire, {
//         Targets: [miloThatchCleverCartographer],
//       });
//
//       Expect(testEngine.getCardModel(miloThatchCleverCartographer).zone).toBe(
//         "discard",
//       );
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(cardUnderTest.exerted).toBe(true);
//     });
//   });
// });
//
