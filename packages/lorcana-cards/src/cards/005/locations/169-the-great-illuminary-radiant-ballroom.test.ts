// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { scepterOfArendelle } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { theGreatIlluminaryRadiantBallroom } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Great Illuminary - Radiant Ballroom", () => {
//   Describe("**WARM WELCOME** Characters with **Support** get +1 {L} and +2 {W}️ while here.", () => {
//     It("should give characters with **Support** +1 {L} and +2 {W}️", () => {
//       Const testStore = new TestStore({
//         Inkwell: theGreatIlluminaryRadiantBallroom.moveCost,
//         Play: [
//           TheGreatIlluminaryRadiantBallroom,
//           LiloMakingAWish,
//           ScepterOfArendelle,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getCard(
//         TheGreatIlluminaryRadiantBallroom,
//       );
//       Const target = testStore.getCard(liloMakingAWish);
//       Const item = testStore.getCard(scepterOfArendelle);
//
//       Expect(target.willpower).toEqual(liloMakingAWish.willpower);
//       Expect(target.lore).toEqual(liloMakingAWish.lore);
//
//       Target.enterLocation(cardUnderTest);
//
//       Expect(target.willpower).toEqual(liloMakingAWish.willpower);
//       Expect(target.lore).toEqual(liloMakingAWish.lore);
//
//       Item.activate();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.hasSupport).toEqual(true);
//       Expect(target.willpower).toEqual(liloMakingAWish.willpower + 2);
//       Expect(target.lore).toEqual(liloMakingAWish.lore + 1);
//       Expect(cardUnderTest.willpower).toEqual(
//         TheGreatIlluminaryRadiantBallroom.willpower,
//       );
//     });
//   });
// });
//
