// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   ChipTheTeacupGentleSoul,
//   HeiheiPersistentPresence,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Export function heiheiPersistenetPresenceTestCases() {
//   Describe("**HE'S BACK!** When this character is banished in a challenge, return this card to your hand.", () => {
//     It("should not return to hand when banished out of a challenge", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: dragonFire.cost,
//           Hand: [dragonFire],
//         },
//         {
//           Play: [heiheiPersistentPresence],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         HeiheiPersistentPresence.id,
//         "player_two",
//       );
//       Const removal = testStore.getByZoneAndId("hand", dragonFire.id);
//
//       Removal.playFromHand();
//       TestStore.resolveTopOfStack({ targetId: cardUnderTest.instanceId });
//
//       Expect(cardUnderTest.zone).toEqual("discard");
//     });
//
//     It("as an attacker, should return to hand when banished", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [heiheiPersistentPresence],
//         },
//         {
//           Play: [chipTheTeacupGentleSoul],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         HeiheiPersistentPresence.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         ChipTheTeacupGentleSoul.id,
//         "player_two",
//       );
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(defender.zone).toEqual("play");
//
//       Defender.updateCardMeta({ exerted: true });
//       CardUnderTest.challenge(defender);
//
//       Expect(cardUnderTest.zone).toEqual("hand");
//       Expect(defender.zone).toEqual("discard");
//     });
//
//     It("as a defender, should return to hand when banished", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [chipTheTeacupGentleSoul],
//         },
//         {
//           Play: [heiheiPersistentPresence],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         HeiheiPersistentPresence.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         ChipTheTeacupGentleSoul.id,
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//       TestStore.resolveTopOfStack();
//
//       Expect(cardUnderTest.zone).toEqual("hand");
//       Expect(attacker.zone).toEqual("discard");
//     });
//   });
// }
//
// Describe("'When this character is banished in a challenge' trigger", () => {
//   HeiheiPersistenetPresenceTestCases();
// });
//
