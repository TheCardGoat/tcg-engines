// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { captainHookCaptainOfTheJollyRoger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { beastTragicHero } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { theBareNecessities } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { amethystChromicon } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mr. Smee - Bumbling Mate", () => {
//   Describe("**OH DEAR, DEAR, DEAR** At the end of your turn, if this character is exerted while you do not have a Captain character in play, deal 1 damage to this character.", () => {
//     It("Mr. Smee is exerted, Opponent has a Captain in play", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [mrSmeeBumblingMate],
//         },
//         {
//           Play: [captainHookCaptainOfTheJollyRoger],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         MrSmeeBumblingMate.id,
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       TestStore.passTurn();
//
//       Expect(cardUnderTest.meta.damage).toBe(1);
//     });
//
//     Describe("When Mr. Smee - Bumbling Mate is exerted", () => {
//       It("when a captain in play, does NOT deal one damage to itself", () => {
//         Const testStore = new TestStore({
//           Play: [mrSmeeBumblingMate, captainHookCaptainOfTheJollyRoger],
//         });
//
//         Const cardUnderTest = testStore.getByZoneAndId(
//           "play",
//           MrSmeeBumblingMate.id,
//         );
//
//         CardUnderTest.updateCardMeta({ exerted: true });
//
//         TestStore.passTurn();
//
//         Expect(cardUnderTest.meta.damage).toBeFalsy();
//       });
//
//       It("when a captain in NOT in play, deals one damage to itself", () => {
//         Const testStore = new TestStore({
//           Play: [mrSmeeBumblingMate],
//         });
//
//         Const cardUnderTest = testStore.getByZoneAndId(
//           "play",
//           MrSmeeBumblingMate.id,
//         );
//
//         CardUnderTest.updateCardMeta({ exerted: true });
//
//         TestStore.passTurn();
//
//         Expect(cardUnderTest.meta.damage).toBe(1);
//       });
//     });
//
//     Describe("When Mr. Smee - Bumbling Mate is NOT exerted", () => {
//       It("when a captain in play, does NOT deal one damage to itself", () => {
//         Const testStore = new TestStore({
//           Play: [mrSmeeBumblingMate, captainHookCaptainOfTheJollyRoger],
//         });
//
//         Const cardUnderTest = testStore.getByZoneAndId(
//           "play",
//           MrSmeeBumblingMate.id,
//         );
//
//         CardUnderTest.updateCardMeta({ exerted: false });
//
//         TestStore.passTurn();
//
//         Expect(cardUnderTest.meta.damage).toBeFalsy();
//       });
//
//       It("when a captain in NOT in play, does NOT deal one damage to itself", () => {
//         Const testStore = new TestStore({
//           Play: [mrSmeeBumblingMate],
//         });
//
//         Const cardUnderTest = testStore.getByZoneAndId(
//           "play",
//           MrSmeeBumblingMate.id,
//         );
//
//         CardUnderTest.updateCardMeta({ exerted: false });
//
//         TestStore.passTurn();
//
//         Expect(cardUnderTest.meta.damage).toBeFalsy();
//       });
//     });
//   });
// });
//
// Describe("Regression tests", () => {
//   It("Mr Smee is not taking damage", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [mrSmeeBumblingMate, amethystChromicon],
//       },
//       {
//         Play: [beastTragicHero],
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(mrSmeeBumblingMate);
//     Const beast = testStore.getCard(beastTragicHero);
//
//     Beast.updateCardMeta({ exerted: true, damage: 2 });
//     CardUnderTest.quest();
//
//     TestStore.passTurn();
//
//     Expect(cardUnderTest.meta.damage).toBe(1);
//   });
//
//   It("Sing", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mrSmeeBumblingMate],
//       Hand: [theBareNecessities],
//     });
//
//     Await testEngine.singSong({
//       Singer: mrSmeeBumblingMate,
//       Song: theBareNecessities,
//     });
//   });
// });
//
