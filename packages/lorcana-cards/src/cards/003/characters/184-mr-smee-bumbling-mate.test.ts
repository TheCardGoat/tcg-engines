// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { captainHookCaptainOfTheJollyRoger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { beastTragicHero } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { theBareNecessities } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { amethystChromicon } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mr. Smee - Bumbling Mate", () => {
//   describe("**OH DEAR, DEAR, DEAR** At the end of your turn, if this character is exerted while you do not have a Captain character in play, deal 1 damage to this character.", () => {
//     it("Mr. Smee is exerted, Opponent has a Captain in play", () => {
//       const testStore = new TestStore(
//         {
//           play: [mrSmeeBumblingMate],
//         },
//         {
//           play: [captainHookCaptainOfTheJollyRoger],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         mrSmeeBumblingMate.id,
//       );
//
//       cardUnderTest.updateCardMeta({ exerted: true });
//
//       testStore.passTurn();
//
//       expect(cardUnderTest.meta.damage).toBe(1);
//     });
//
//     describe("When Mr. Smee - Bumbling Mate is exerted", () => {
//       it("when a captain in play, does NOT deal one damage to itself", () => {
//         const testStore = new TestStore({
//           play: [mrSmeeBumblingMate, captainHookCaptainOfTheJollyRoger],
//         });
//
//         const cardUnderTest = testStore.getByZoneAndId(
//           "play",
//           mrSmeeBumblingMate.id,
//         );
//
//         cardUnderTest.updateCardMeta({ exerted: true });
//
//         testStore.passTurn();
//
//         expect(cardUnderTest.meta.damage).toBeFalsy();
//       });
//
//       it("when a captain in NOT in play, deals one damage to itself", () => {
//         const testStore = new TestStore({
//           play: [mrSmeeBumblingMate],
//         });
//
//         const cardUnderTest = testStore.getByZoneAndId(
//           "play",
//           mrSmeeBumblingMate.id,
//         );
//
//         cardUnderTest.updateCardMeta({ exerted: true });
//
//         testStore.passTurn();
//
//         expect(cardUnderTest.meta.damage).toBe(1);
//       });
//     });
//
//     describe("When Mr. Smee - Bumbling Mate is NOT exerted", () => {
//       it("when a captain in play, does NOT deal one damage to itself", () => {
//         const testStore = new TestStore({
//           play: [mrSmeeBumblingMate, captainHookCaptainOfTheJollyRoger],
//         });
//
//         const cardUnderTest = testStore.getByZoneAndId(
//           "play",
//           mrSmeeBumblingMate.id,
//         );
//
//         cardUnderTest.updateCardMeta({ exerted: false });
//
//         testStore.passTurn();
//
//         expect(cardUnderTest.meta.damage).toBeFalsy();
//       });
//
//       it("when a captain in NOT in play, does NOT deal one damage to itself", () => {
//         const testStore = new TestStore({
//           play: [mrSmeeBumblingMate],
//         });
//
//         const cardUnderTest = testStore.getByZoneAndId(
//           "play",
//           mrSmeeBumblingMate.id,
//         );
//
//         cardUnderTest.updateCardMeta({ exerted: false });
//
//         testStore.passTurn();
//
//         expect(cardUnderTest.meta.damage).toBeFalsy();
//       });
//     });
//   });
// });
//
// describe("Regression tests", () => {
//   it("Mr Smee is not taking damage", () => {
//     const testStore = new TestStore(
//       {
//         play: [mrSmeeBumblingMate, amethystChromicon],
//       },
//       {
//         play: [beastTragicHero],
//         deck: 1,
//       },
//     );
//
//     const cardUnderTest = testStore.getCard(mrSmeeBumblingMate);
//     const beast = testStore.getCard(beastTragicHero);
//
//     beast.updateCardMeta({ exerted: true, damage: 2 });
//     cardUnderTest.quest();
//
//     testStore.passTurn();
//
//     expect(cardUnderTest.meta.damage).toBe(1);
//   });
//
//   it("Sing", async () => {
//     const testEngine = new TestEngine({
//       play: [mrSmeeBumblingMate],
//       hand: [theBareNecessities],
//     });
//
//     await testEngine.singSong({
//       singer: mrSmeeBumblingMate,
//       song: theBareNecessities,
//     });
//   });
// });
//
