import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { mulanImperialSoldier } from "./118-mulan-imperial-soldier";

describe("Mulan - Imperial Soldier", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [mulanImperialSoldier] });
  //   Expect(testEngine.getCardModel(mulanImperialSoldier).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

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
//   MulanImperialSoldier,
//   TeKaHeartless,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mulan - Imperial Soldier", () => {
//   Describe("**Lead by example** During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.", () => {
//     It("should deal two damage", () => {
//       Const otherCharacters = [moanaOfMotunui, mauiHeroToAll];
//       Const testStore = new TestStore(
//         {
//           Play: [mulanImperialSoldier, ...otherCharacters],
//         },
//         {
//           Play: [heiheiBoatSnack, teKaHeartless],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         MulanImperialSoldier.id,
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
//       TestStore.resolveTopOfStack();
//
//       For (const character of otherCharacters) {
//         Const card = testStore.getByZoneAndId(
//           "play",
//           Character.id,
//           "player_one",
//         );
//
//         Expect(card.lore).toEqual((card.lorcanitoCard?.lore || 0) + 1);
//       }
//     });
//
//     It("opponent's don't get the bonus", () => {
//       Const otherCharacters = [moanaOfMotunui, mauiHeroToAll];
//       Const testStore = new TestStore(
//         {
//           Play: [mulanImperialSoldier, ...otherCharacters],
//         },
//         {
//           Play: [heiheiBoatSnack, teKaHeartless],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         MulanImperialSoldier.id,
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
//           Play: [mulanImperialSoldier],
//         },
//         {
//           Play: [heiheiBoatSnack, teKaHeartless],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         MulanImperialSoldier.id,
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
//       Expect(attacker.lore).toEqual(attacker.lorcanitoCard?.lore);
//     });
//   });
// });
//
