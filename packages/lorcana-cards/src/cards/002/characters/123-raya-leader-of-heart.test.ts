// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { rayaLeaderOfHeart } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008/character/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Raya - Leader of Heart", () => {
//   It("Shift", () => {
//     Const testStore = new TestEngine({
//       Play: [rayaLeaderOfHeart],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       RayaLeaderOfHeart.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toEqual(true);
//   });
//
//   It("**CHAMPION OF KUMANDRA** Whenever this character challenges a damaged character, she takes no damage from the challenge.", () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [rayaLeaderOfHeart],
//       },
//       { play: [deweyLovableShowoff] },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(rayaLeaderOfHeart);
//
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Target.exert();
//
//     TestEngine.challenge({
//       Attacker: cardUnderTest,
//       Defender: target,
//     });
//
//     // This test should check that the card goes to discard since the target is not damaged
//     Expect(cardUnderTest.zone).toEqual("discard");
//   });
//
//   It("**CHAMPION OF KUMANDRA** Damaged character target.", () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [rayaLeaderOfHeart],
//       },
//       { play: [deweyLovableShowoff] },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(rayaLeaderOfHeart);
//
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Target.exert();
//     Target.damage = 1;
//
//     TestEngine.challenge({
//       Attacker: cardUnderTest,
//       Defender: target,
//     });
//
//     // Raya should stay in play when challenging a damaged character
//     Expect(cardUnderTest.zone).toEqual("play");
//
//     // And should take no damage from the challenge
//     Expect(cardUnderTest.damage).toEqual(0);
//   });
// });
//
