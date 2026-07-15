// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HeiheiBoatSnack,
//   MauiHeroToAll,
//   MoanaOfMotunui,
//   TeKaHeartless,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { donaldDuckBuccaneer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Donald Duck - Buccaneer", () => {
//   Describe("**BOARDING PARTY** During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.", () => {
//     It("should deal two damage", async () => {
//       Const otherCharacters = [moanaOfMotunui, mauiHeroToAll];
//       Const testStore = new TestEngine(
//         {
//           Play: [donaldDuckBuccaneer, ...otherCharacters],
//         },
//         {
//           Play: [heiheiBoatSnack],
//         },
//       );
//
//       Await testStore.challenge({
//         Attacker: donaldDuckBuccaneer,
//         Defender: heiheiBoatSnack,
//         ExertDefender: true,
//       });
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//       For (const character of otherCharacters) {
//         Expect(testStore.getCardModel(character).lore).toEqual(
//           Character.lore + 1,
//         );
//       }
//     });
//
//     It("opponent's don't get the bonus", () => {
//       Const otherCharacters = [moanaOfMotunui, mauiHeroToAll];
//       Const testStore = new TestStore(
//         {
//           Play: [donaldDuckBuccaneer, ...otherCharacters],
//         },
//         {
//           Play: [heiheiBoatSnack, teKaHeartless],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", donaldDuckBuccaneer.id);
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
//       Const card = testStore.getByZoneAndId(
//         "play",
//         TeKaHeartless.id,
//         "player_two",
//       );
//
//       Expect(card.lore).not.toEqual((card.lorcanitoCard?.lore || 0) + 1);
//     });
//
//     It("Mulan itself doesn't get the bonus", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [donaldDuckBuccaneer],
//         },
//         {
//           Play: [heiheiBoatSnack, teKaHeartless],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", donaldDuckBuccaneer.id);
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
//       Expect(attacker.lore).not.toEqual(
//         (attacker.lorcanitoCard?.lore || 0) + 1,
//       );
//     });
//   });
// });
//
