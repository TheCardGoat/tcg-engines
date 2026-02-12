// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DragonFire,
//   FireTheCannons,
// } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   DrFacilierAgentProvocateur,
//   HeiheiBoatSnack,
//   MauiHeroToAll,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dr. Facilier - Agent Provocateur", () => {
//   Describe("Into the Shadows: Whenever one of your other characters is banished in a challenge, you may return that card to your hand.", () => {
//     It("returns attacker character to hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [heiheiBoatSnack, drFacilierAgentProvocateur],
//         },
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", heiheiBoatSnack.id);
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//       TestStore.resolveTopOfStack();
//
//       Expect(testStore.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({ hand: 1, play: 1 }),
//       );
//     });
//
//     It("returns defender character to hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//         {
//           Play: [heiheiBoatSnack, drFacilierAgentProvocateur],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         HeiheiBoatSnack.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//       TestStore.changePlayer("player_two");
//       TestStore.resolveTopOfStack();
//
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ hand: 1, play: 1 }),
//       );
//     });
//
//     It("lets player skip the effect", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [mickeyMouseTrueFriend],
//         },
//         {
//           Play: [heiheiBoatSnack, drFacilierAgentProvocateur],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         HeiheiBoatSnack.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//
//       TestStore.changePlayer("player_two");
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ discard: 1, play: 1 }),
//       );
//     });
//
//     It("doesn't return itself to hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [mauiHeroToAll],
//         },
//         {
//           Play: [heiheiBoatSnack, drFacilierAgentProvocateur],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", mauiHeroToAll.id);
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         DrFacilierAgentProvocateur.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//
//       Expect(testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ discard: 1, play: 1 }),
//       );
//     });
//
//     It("doesn't return card to hand if it's banished outside a challenge", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: fireTheCannons.cost,
//           Hand: [fireTheCannons],
//         },
//         {
//           Play: [heiheiBoatSnack, drFacilierAgentProvocateur],
//         },
//       );
//
//       Await testEngine.playCard(fireTheCannons);
//       Await testEngine.resolveTopOfStack({ targets: [heiheiBoatSnack] });
//
//       Expect(testEngine.testStore.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ discard: 1, play: 1 }),
//       );
//     });
//
//     It("Doesn't return self when banished outside of a challenge", () => {
//       Const testStore = new TestStore(
//         {
//           Hand: [dragonFire],
//           Inkwell: dragonFire.cost,
//         },
//         {
//           Play: [drFacilierAgentProvocateur],
//         },
//       );
//
//       Const removal = testStore.getByZoneAndId("hand", dragonFire.id);
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         DrFacilierAgentProvocateur.id,
//         "player_two",
//       );
//
//       Removal.playFromHand();
//
//       TestStore.resolveTopOfStack({
//         TargetId: cardUnderTest.instanceId,
//       });
//
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       Expect(cardUnderTest.zone).toEqual("discard");
//     });
//
//     Describe("Opponent's chars should not be affected by Into the Shadows", () => {
//       It("doesn't return attacker character to hand", () => {
//         Const testStore = new TestStore(
//           {
//             Play: [mickeyMouseTrueFriend, drFacilierAgentProvocateur],
//           },
//           {
//             Play: [heiheiBoatSnack],
//           },
//         );
//
//         Const attacker = testStore.getByZoneAndId(
//           "play",
//           MickeyMouseTrueFriend.id,
//         );
//         Const defender = testStore.getByZoneAndId(
//           "play",
//           HeiheiBoatSnack.id,
//           "player_two",
//         );
//
//         Defender.updateCardMeta({ exerted: true });
//
//         Attacker.challenge(defender);
//
//         Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//         Expect(defender.isDead).toEqual(true);
//       });
//
//       It("doesn't return defender character to hand", () => {
//         Const testStore = new TestStore(
//           {
//             Play: [mickeyMouseTrueFriend, drFacilierAgentProvocateur],
//           },
//           {
//             Play: [heiheiBoatSnack],
//           },
//         );
//
//         Const attacker = testStore.getByZoneAndId(
//           "play",
//           MickeyMouseTrueFriend.id,
//         );
//         Const defender = testStore.getByZoneAndId(
//           "play",
//           HeiheiBoatSnack.id,
//           "player_two",
//         );
//
//         Defender.updateCardMeta({ exerted: true });
//
//         Attacker.challenge(defender);
//
//         Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//         Expect(defender.isDead).toEqual(true);
//       });
//     });
//   });
//
//   Describe("Regression", () => {
//     It("When Dr. Facilier is banished, his effect should not trigger.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [mickeyMouseTrueFriend, mauiHeroToAll],
//           Hand: [dragonFire],
//           Inkwell: dragonFire.cost,
//         },
//         {
//           Play: [
//             HeiheiBoatSnack,
//             DrFacilierAgentProvocateur,
//             DrFacilierAgentProvocateur,
//           ],
//         },
//       );
//
//       Const firstFacilier = testEngine.getCardModel(
//         DrFacilierAgentProvocateur,
//         0,
//       );
//
//       // Removing the first Dr. Facilier from play, using an action.
//       Await testEngine.playCard(dragonFire, { targets: [firstFacilier] });
//
//       Expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//       Expect(firstFacilier.zone).toEqual("discard");
//
//       Const secondFacilier = testEngine.getCardModel(
//         DrFacilierAgentProvocateur,
//         1,
//       );
//       SecondFacilier.updateCardMeta({ exerted: true });
//
//       // Removing second Facilier from play, using a challenge.
//       Await testEngine.challenge({
//         Attacker: mauiHeroToAll,
//         Defender: secondFacilier,
//       });
//
//       Expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//       Expect(secondFacilier.zone).toEqual("discard");
//
//       Await testEngine.tapCard(heiheiBoatSnack);
//
//       // And lastly, challenging another char to make sure the effect doesn't trigger.
//       Await testEngine.challenge({
//         Attacker: mickeyMouseTrueFriend,
//         Defender: heiheiBoatSnack,
//       });
//
//       Expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//       Expect(testEngine.getCardModel(heiheiBoatSnack).isDead).toEqual(true);
//
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({ discard: 3 }),
//       );
//     });
//   });
// });
//
