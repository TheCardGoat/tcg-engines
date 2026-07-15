// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mrSmee } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   BillyBonesKeeperOfTheMap,
//   GenieCrampedInTheLamp,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { walkThePlank } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Walk The Plank!", () => {
//   It("Your Pirate characters gain '{E} – Banish chosen damaged character' this turn.", async () => {
//     Const pirates = [billyBonesKeeperOfTheMap, mrSmee];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: walkThePlank.cost,
//         Play: pirates,
//         Hand: [walkThePlank],
//       },
//       {
//         Play: [genieCrampedInTheLamp],
//       },
//     );
//
//     Await testEngine.setCardDamage(genieCrampedInTheLamp, 1);
//
//     For (const pirate of pirates) {
//       Expect(testEngine.getCardModel(pirate).hasActivatedAbility).toEqual(
//         False,
//       );
//     }
//
//     Await testEngine.playCard(walkThePlank);
//
//     For (const pirate of pirates) {
//       Expect(testEngine.getCardModel(pirate).hasActivatedAbility).toEqual(true);
//     }
//
//     Await testEngine.activateCard(mrSmee, { targets: [genieCrampedInTheLamp] });
//     Expect(testEngine.getCardModel(genieCrampedInTheLamp).zone).toBe("discard");
//   });
// });
//
