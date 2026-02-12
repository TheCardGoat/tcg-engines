// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   MerlinCrab,
//   YzmaWithoutBeautySleep,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merlin - Crab", () => {
//   Describe("**READY OR NOT!** When you play this character and when he leaves play, chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_", () => {
//     It("When you play", () => {
//       Const testStore = new TestStore({
//         Inkwell: merlinCrab.cost,
//         Hand: [merlinCrab],
//         Play: [yzmaWithoutBeautySleep],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", merlinCrab.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         YzmaWithoutBeautySleep.id,
//       );
//
//       Expect(target.hasChallenger).toEqual(false);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.hasChallenger).toEqual(true);
//     });
//
//     It("When he leaves play", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [merlinCrab],
//           Deck: 1,
//         },
//         { play: [goofyKnightForADay] },
//       );
//
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         GoofyKnightForADay.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId("play", merlinCrab.id);
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Expect(defender.hasChallenger).toEqual(false);
//
//       Attacker.challenge(defender);
//       TestStore.resolveTopOfStack({ targets: [defender] });
//
//       Expect(defender.hasChallenger).toEqual(true);
//     });
//   });
// });
//
