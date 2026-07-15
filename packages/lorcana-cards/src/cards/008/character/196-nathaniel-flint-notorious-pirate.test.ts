// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   JiminyCricketLevelheadedAndWise,
//   NathanielFlintNotoriousPirate,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nathaniel Flint - Notorious Pirate", () => {
//   It("PREDATORY INSTINCT You can't play this character unless an opposing character was damaged this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: nathanielFlintNotoriousPirate.cost,
//       Play: [],
//       Hand: [nathanielFlintNotoriousPirate],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       NathanielFlintNotoriousPirate,
//     );
//     Await testEngine.playCard(nathanielFlintNotoriousPirate);
//
//     Expect(cardUnderTest.zone).toBe("hand");
//   });
//
//   It("PREDATORY INSTINCT When damage has been dealt to opposing character this turn, you can play this character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: nathanielFlintNotoriousPirate.cost + fireTheCannons.cost,
//         Play: [],
//         Hand: [nathanielFlintNotoriousPirate, fireTheCannons],
//       },
//       {
//         Play: [hiramFlavershamToymaker],
//       },
//     );
//
//     Await testEngine.playCard(fireTheCannons);
//     Await testEngine.resolveTopOfStack({ targets: [hiramFlavershamToymaker] });
//     Await testEngine.playCard(nathanielFlintNotoriousPirate);
//
//     Expect(testEngine.getCardModel(nathanielFlintNotoriousPirate).zone).toBe(
//       "play",
//     );
//   });
//
//   It("PREDATORY INSTINCT When damage has been dealt to owner's character this turn, you cannot play this character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: nathanielFlintNotoriousPirate.cost + fireTheCannons.cost,
//       Play: [hiramFlavershamToymaker],
//       Hand: [nathanielFlintNotoriousPirate, fireTheCannons],
//     });
//
//     Await testEngine.playCard(fireTheCannons);
//     Await testEngine.resolveTopOfStack({ targets: [hiramFlavershamToymaker] });
//     Await testEngine.playCard(nathanielFlintNotoriousPirate);
//
//     Expect(testEngine.getCardModel(nathanielFlintNotoriousPirate).zone).toBe(
//       "hand",
//     );
//   });
//
//   It("PREDATORY INSTINCT When opposing character is banished by the damage", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: nathanielFlintNotoriousPirate.cost + fireTheCannons.cost,
//         Play: [],
//         Hand: [nathanielFlintNotoriousPirate, fireTheCannons],
//       },
//       {
//         Play: [jiminyCricketLevelheadedAndWise],
//       },
//     );
//
//     Await testEngine.playCard(fireTheCannons);
//     Await testEngine.resolveTopOfStack({
//       Targets: [jiminyCricketLevelheadedAndWise],
//     });
//     Await testEngine.playCard(nathanielFlintNotoriousPirate);
//
//     Expect(testEngine.getCardModel(nathanielFlintNotoriousPirate).zone).toBe(
//       "play",
//     );
//   });
// });
//
