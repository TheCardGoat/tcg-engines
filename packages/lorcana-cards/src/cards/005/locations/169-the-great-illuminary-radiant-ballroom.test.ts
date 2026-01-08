// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { scepterOfArendelle } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { theGreatIlluminaryRadiantBallroom } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("The Great Illuminary - Radiant Ballroom", () => {
//   describe("**WARM WELCOME** Characters with **Support** get +1 {L} and +2 {W}️ while here.", () => {
//     it("should give characters with **Support** +1 {L} and +2 {W}️", () => {
//       const testStore = new TestStore({
//         inkwell: theGreatIlluminaryRadiantBallroom.moveCost,
//         play: [
//           theGreatIlluminaryRadiantBallroom,
//           liloMakingAWish,
//           scepterOfArendelle,
//         ],
//       });
//
//       const cardUnderTest = testStore.getCard(
//         theGreatIlluminaryRadiantBallroom,
//       );
//       const target = testStore.getCard(liloMakingAWish);
//       const item = testStore.getCard(scepterOfArendelle);
//
//       expect(target.willpower).toEqual(liloMakingAWish.willpower);
//       expect(target.lore).toEqual(liloMakingAWish.lore);
//
//       target.enterLocation(cardUnderTest);
//
//       expect(target.willpower).toEqual(liloMakingAWish.willpower);
//       expect(target.lore).toEqual(liloMakingAWish.lore);
//
//       item.activate();
//       testStore.resolveTopOfStack({ targets: [target] });
//
//       expect(target.hasSupport).toEqual(true);
//       expect(target.willpower).toEqual(liloMakingAWish.willpower + 2);
//       expect(target.lore).toEqual(liloMakingAWish.lore + 1);
//       expect(cardUnderTest.willpower).toEqual(
//         theGreatIlluminaryRadiantBallroom.willpower,
//       );
//     });
//   });
// });
//
