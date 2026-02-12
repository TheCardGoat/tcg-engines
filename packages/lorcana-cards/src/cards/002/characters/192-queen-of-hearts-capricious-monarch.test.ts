// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArthurTrainedSwordsman,
//   HerculesHeroInTraining,
//   QueenOfHeartsCapriciousMonarch,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { brawl } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Queen of Hearts- Capricious Monarch", () => {
//   Describe("**OFF WITH THEIR HEADS!** Whenever an opposing character is banished, you may ready this character.", () => {
//     It("on challenge", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [queenOfHeartsCapriciousMonarch, arthurTrainedSwordsman],
//         },
//         {
//           Play: [herculesHeroInTraining],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(queenOfHeartsCapriciousMonarch);
//       Const target = testStore.getCard(herculesHeroInTraining);
//       Const challenger = testStore.getCard(arthurTrainedSwordsman);
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Expect(cardUnderTest.meta.exerted).toEqual(true);
//
//       Target.updateCardMeta({ exerted: true });
//       Expect(target.meta.exerted).toEqual(true);
//
//       Challenger.challenge(target);
//       Expect(target.zone).toEqual("discard");
//
//       TestStore.resolveOptionalAbility();
//       Expect(cardUnderTest.meta.exerted).toBeFalsy();
//     });
//
//     It("on removal", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: brawl.cost,
//           Hand: [brawl],
//           Play: [queenOfHeartsCapriciousMonarch],
//         },
//         {
//           Play: [herculesHeroInTraining],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(queenOfHeartsCapriciousMonarch);
//       Const target = testStore.getCard(herculesHeroInTraining);
//       Const removal = testStore.getCard(brawl);
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Expect(cardUnderTest.meta.exerted).toEqual(true);
//
//       Removal.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] }, true);
//
//       Expect(target.zone).toEqual("discard");
//       Expect(removal.zone).toEqual("discard");
//
//       TestStore.resolveOptionalAbility();
//       Expect(cardUnderTest.meta.exerted).toEqual(false);
//     });
//   });
// });
//
