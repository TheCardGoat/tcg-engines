// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CaterpillarCalmAndCollected,
//   HiramFlavershamToymaker,
//   JasmineHeirOfAgrabah,
//   ShereKhanMenacingPredator,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Shere Khan - Menacing Predator", () => {
//   It("**DON'T INSULT MY INTELLIGENCE** Whenever one of your characters challenges another character, gain 1 lore.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [
//           ShereKhanMenacingPredator,
//           CaterpillarCalmAndCollected,
//           JasmineHeirOfAgrabah,
//         ],
//       },
//       {
//         Play: [hiramFlavershamToymaker],
//       },
//     );
//
//     Const defender = testStore.getByZoneAndId(
//       "play",
//       HiramFlavershamToymaker.id,
//       "player_two",
//     );
//     Defender.updateCardMeta({ exerted: true });
//
//     Const attackerOne = testStore.getByZoneAndId(
//       "play",
//       CaterpillarCalmAndCollected.id,
//     );
//     Const attackerTwo = testStore.getByZoneAndId(
//       "play",
//       JasmineHeirOfAgrabah.id,
//     );
//
//     Expect(testStore.getPlayerLore()).toEqual(0);
//
//     AttackerOne.challenge(defender);
//     TestStore.resolveOptionalAbility();
//     Expect(testStore.getPlayerLore()).toEqual(1);
//
//     AttackerTwo.challenge(defender);
//     TestStore.resolveOptionalAbility();
//     Expect(testStore.getPlayerLore()).toEqual(2);
//   });
// });
//
