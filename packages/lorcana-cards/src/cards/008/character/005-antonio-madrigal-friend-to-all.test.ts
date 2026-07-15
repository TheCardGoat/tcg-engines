// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { thisIsMyFamily } from "@lorcanito/lorcana-engine/cards/007";
// Import {
//   AntonioMadrigalFriendToAll,
//   DeweyLovableShowoff,
//   GoofyGroundbreakingChef,
//   HueyReliableLeader,
//   LouieOneCoolDuck,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Antonio Madrigal - Friend to All", () => {
//   It("OF COURSE THEY CAN COME Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [antonioMadrigalFriendToAll],
//       Hand: [thisIsMyFamily],
//       Deck: [
//         LouieOneCoolDuck,
//         DeweyLovableShowoff,
//         HueyReliableLeader,
//         GoofyGroundbreakingChef,
//       ],
//     });
//
//     Const cardTest = testEngine.getCardModel(antonioMadrigalFriendToAll);
//
//     Await testEngine.singSong({
//       Singer: cardTest,
//       Song: testEngine.getCardModel(thisIsMyFamily),
//     });
//
//     Await testEngine.resolveOptionalAbility();
//
//     Await testEngine.resolveTopOfStack({ targets: [louieOneCoolDuck] });
//
//     Expect(testEngine.getCardModel(louieOneCoolDuck).zone).toEqual("hand");
//
//     Expect(testEngine.getCardModel(louieOneCoolDuck).isRevealed).toEqual(true);
//   });
// });
//
