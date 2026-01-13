// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   liloMakingAWish,
//   stichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { aladdinBraveRescuer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { hiroHamadaRoboticsProdigy } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hiro Hamada - Robotics Prodigy", () => {
//   it("**SWEET TECH**  {E}, 2 {I} − Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: 2,
//         play: [hiroHamadaRoboticsProdigy],
//         deck: [liloMakingAWish, stichtNewDog, pawpsicle, aladdinBraveRescuer],
//       },
//       {
//         deck: 1,
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(hiroHamadaRoboticsProdigy);
//     const target = testEngine.getCardModel(pawpsicle);
//     await testEngine.activateCard(cardUnderTest, { ability: "SWEET TECH" });
//
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     await testEngine.passTurn();
//     await testEngine.passTurn();
//
//     expect(target.zone).toEqual("hand");
//   });
// });
//
