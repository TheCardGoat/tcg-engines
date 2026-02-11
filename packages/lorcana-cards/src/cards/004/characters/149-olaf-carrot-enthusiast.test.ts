// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DocLeaderOfTheSevenDwarfs,
//   DopeyAlwaysPlayful,
//   GrumpyBadTempered,
//   HappyGoodNatured,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { olafCarrotEnthusiast } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Olaf - Carrot Enthusiast", () => {
//   It("**CARROTS ALL AROUND!** Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: olafCarrotEnthusiast.cost,
//       Play: [
//         OlafCarrotEnthusiast,
//         DocLeaderOfTheSevenDwarfs,
//         DopeyAlwaysPlayful,
//         GrumpyBadTempered,
//         HappyGoodNatured,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       OlafCarrotEnthusiast.id,
//     );
//
//     Const targets = [
//       TestStore.getByZoneAndId("play", docLeaderOfTheSevenDwarfs.id),
//       TestStore.getByZoneAndId("play", dopeyAlwaysPlayful.id),
//       TestStore.getByZoneAndId("play", grumpyBadTempered.id),
//       TestStore.getByZoneAndId("play", happyGoodNatured.id),
//     ];
//
//     // Store initial strengths
//     Const initialStrengths = targets.map((target) => target.strength);
//
//     CardUnderTest.playFromHand();
//     CardUnderTest.quest();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets });
//
//     Targets.forEach((target, index) => {
//       Expect(target.strength).toBe(
//         InitialStrengths[index]! + olafCarrotEnthusiast.strength,
//       );
//     });
//   });
// });
//
