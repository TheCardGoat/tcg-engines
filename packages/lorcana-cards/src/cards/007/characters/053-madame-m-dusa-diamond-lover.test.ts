// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { madameMedusaDiamondLover } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Madame Medusa - Diamond Lover", () => {
//   Describe("SEARCH THE SWAMP Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.", () => {
//     It("Milling opponent", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 10,
//           Play: [madameMedusaDiamondLover, goofyKnightForADay],
//         },
//         {
//           Deck: 10,
//         },
//       );
//
//       Await testEngine.questCard(madameMedusaDiamondLover);
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [goofyKnightForADay],
//         },
//         True,
//       );
//
//       Expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(2);
//
//       Await testEngine.resolveTopOfStack({
//         TargetPlayer: "player_two",
//       });
//
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Discard: 3,
//           Deck: 7,
//         }),
//       );
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Discard: 0,
//           Deck: 10,
//         }),
//       );
//     });
//
//     It("Milling yourself", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 10,
//           Play: [madameMedusaDiamondLover, goofyKnightForADay],
//         },
//         {
//           Deck: 10,
//         },
//       );
//
//       Await testEngine.questCard(madameMedusaDiamondLover);
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [goofyKnightForADay],
//         },
//         True,
//       );
//
//       Expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(2);
//
//       Await testEngine.resolveTopOfStack({
//         TargetPlayer: "player_one",
//       });
//
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Discard: 3,
//           Deck: 7,
//         }),
//       );
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Discard: 0,
//           Deck: 10,
//         }),
//       );
//     });
//   });
// });
//
