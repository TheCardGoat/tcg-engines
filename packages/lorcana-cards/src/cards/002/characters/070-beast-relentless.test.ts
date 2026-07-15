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
//   BeastRelentless,
//   DonaldDuckPerfectGentleman,
//   GoofyKnightForADay,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Beast - Relentless", () => {
//   Describe("**SECOND WIND** Whenever an opposing character is damaged, you may ready this character.", () => {
//     It("Beast himself challenging other", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: beastRelentless.cost,
//           Play: [beastRelentless],
//         },
//         {
//           Play: [donaldDuckPerfectGentleman],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         BeastRelentless.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         DonaldDuckPerfectGentleman.id,
//         "player_two",
//       );
//
//       Target.updateCardMeta({ exerted: true });
//       CardUnderTest.challenge(target);
//
//       TestStore.resolveOptionalAbility();
//
//       Expect(cardUnderTest.ready).toBe(true);
//     });
//
//     It("Damaged in combat", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: beastRelentless.cost,
//           Play: [beastRelentless, goofyKnightForADay],
//         },
//         {
//           Play: [donaldDuckPerfectGentleman],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         BeastRelentless.id,
//       );
//       Const attacker = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         DonaldDuckPerfectGentleman.id,
//         "player_two",
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//
//       TestStore.resolveOptionalAbility();
//
//       Expect(cardUnderTest.ready).toBe(true);
//     });
//
//     It("Damaged by action", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: fireTheCannons.cost,
//           Play: [beastRelentless],
//           Hand: [fireTheCannons],
//         },
//         {
//           Play: [donaldDuckPerfectGentleman],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         BeastRelentless.id,
//       );
//       Const action = testStore.getByZoneAndId("hand", fireTheCannons.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         DonaldDuckPerfectGentleman.id,
//         "player_two",
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Action.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] }, true);
//
//       TestStore.resolveOptionalAbility();
//
//       Expect(cardUnderTest.ready).toBe(true);
//     });
//
//     It("Self character being damaged", () => {
//       Const testStore = new TestStore({
//         Inkwell: fireTheCannons.cost,
//         Play: [beastRelentless, donaldDuckPerfectGentleman],
//         Hand: [fireTheCannons],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         BeastRelentless.id,
//       );
//       Const action = testStore.getByZoneAndId("hand", fireTheCannons.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         DonaldDuckPerfectGentleman.id,
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Action.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(cardUnderTest.ready).toBe(false);
//     });
//
//     It("Opposing character being banished", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: dragonFire.cost,
//           Play: [beastRelentless],
//           Hand: [dragonFire],
//         },
//         {
//           Play: [donaldDuckPerfectGentleman],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         BeastRelentless.id,
//       );
//       Const action = testStore.getByZoneAndId("hand", dragonFire.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         DonaldDuckPerfectGentleman.id,
//         "player_two",
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Action.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(cardUnderTest.ready).toBe(false);
//     });
//
//     It("Beast vs Beast", async () => {
//       Const testStore = new TestEngine(
//         {
//           Play: [beastRelentless],
//         },
//         {
//           Play: [beastRelentless],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", beastRelentless.id);
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         BeastRelentless.id,
//         "player_two",
//       );
//
//       Await testStore.challenge({
//         Attacker,
//         Defender,
//         ExertDefender: true,
//       });
//
//       TestStore.changeActivePlayer("player_one");
//       Await testStore.acceptOptionalLayer(
//         False,
//         TestStore.getLayerIdForPlayer("player_one"),
//       );
//       TestStore.changeActivePlayer("player_two");
//       Await testStore.acceptOptionalLayer(
//         False,
//         TestStore.getLayerIdForPlayer("player_two"),
//       );
//
//       Expect(attacker.ready).toBe(true);
//       Expect(defender.ready).toBe(true);
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
