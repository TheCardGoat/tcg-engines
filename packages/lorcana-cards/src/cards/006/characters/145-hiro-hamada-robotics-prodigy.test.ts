// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { aladdinBraveRescuer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { hiroHamadaRoboticsProdigy } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hiro Hamada - Robotics Prodigy", () => {
//   It("**SWEET TECH**  {E}, 2 {I} − Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 2,
//         Play: [hiroHamadaRoboticsProdigy],
//         Deck: [liloMakingAWish, stichtNewDog, pawpsicle, aladdinBraveRescuer],
//       },
//       {
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(hiroHamadaRoboticsProdigy);
//     Const target = testEngine.getCardModel(pawpsicle);
//     Await testEngine.activateCard(cardUnderTest, { ability: "SWEET TECH" });
//
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Expect(target.zone).toEqual("hand");
//   });
// });
//
