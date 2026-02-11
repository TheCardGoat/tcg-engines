// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PinocchioStarAttraction,
//   PinocchioTalkativePuppet,
//   ScarViciousCheater,
//   TheHuntsmanReluctantEnforcer,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Scar - Vicious Cheater", () => {
//   It("Rush", () => {
//     Const testStore = new TestStore({
//       Play: [scarViciousCheater],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ScarViciousCheater.id,
//     );
//
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
//
//   It("**DADDY ISN’T HERE TO SAVE YOU** During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [scarViciousCheater],
//       },
//       {
//         Play: [
//           TheHuntsmanReluctantEnforcer,
//           PinocchioTalkativePuppet,
//           PinocchioStarAttraction,
//         ],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ScarViciousCheater.id,
//     );
//
//     Const target = testStore.getByZoneAndId(
//       "play",
//       TheHuntsmanReluctantEnforcer.id,
//       "player_two",
//     );
//     Const target2 = testStore.getByZoneAndId(
//       "play",
//       PinocchioTalkativePuppet.id,
//       "player_two",
//     );
//     Const target3 = testStore.getByZoneAndId(
//       "play",
//       PinocchioStarAttraction.id,
//       "player_two",
//     );
//
//     [target, target2, target3].forEach((char) => {
//       Char.updateCardMeta({ exerted: true });
//       CardUnderTest.challenge(char);
//
//       Expect(char.zone).toBe("discard");
//       Expect(cardUnderTest.ready).toBe(true);
//     });
//
//     Expect(cardUnderTest.hasQuestRestriction).toBe(true);
//     Expect(cardUnderTest.damage).toBe(
//       Target.strength + target2.strength + target3.strength,
//     );
//   });
// });
//
// Describe("Regression Test", () => {
//   Const testStore = new TestStore(
//     {
//       Play: [scarViciousCheater],
//     },
//     {
//       Play: [hiddenCoveTranquilHaven],
//     },
//   );
//
//   Const cardUnderTest = testStore.getCard(scarViciousCheater);
//   Const target = testStore.getCard(hiddenCoveTranquilHaven);
//
//   Target.updateCardMeta({
//     Exerted: true,
//     Damage: hiddenCoveTranquilHaven.willpower - 1,
//   });
//
//   CardUnderTest.challenge(target);
//
//   Expect(target.zone).toBe("discard");
//   Expect(cardUnderTest.ready).toBe(false);
//   Expect(cardUnderTest.hasQuestRestriction).toBe(false);
// });
//
