// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuck,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { belleAccomplishedMystic } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { mosquitoBite } from "@lorcanito/lorcana-engine/cards/006";
// Import { balooOlIronPaws } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Baloo - Ol' Iron Paws", () => {
//   Describe("FIGHT LIKE A BEAR Your characters with 7 {S} or more can't be dealt damage.", () => {
//     It("Only gives effect while in play", async () => {
//       Const testEngine = new TestEngine({
//         Play: [goofyKnightForADay],
//         Hand: [balooOlIronPaws],
//         Inkwell: balooOlIronPaws.cost,
//       });
//
//       Expect(
//         TestEngine.getCardModel(goofyKnightForADay).hasDamageDealtRestriction,
//       ).toBe(false);
//
//       Await testEngine.playCard(balooOlIronPaws);
//
//       Expect(
//         TestEngine.getCardModel(goofyKnightForADay).hasDamageDealtRestriction,
//       ).toBe(true);
//     });
//
//     It("As Attacker", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [balooOlIronPaws, goofyKnightForADay],
//         },
//         {
//           Play: [teKaTheBurningOne],
//         },
//       );
//
//       Const attacker = testEngine.getCardModel(goofyKnightForADay);
//       Const defender = testEngine.getCardModel(teKaTheBurningOne);
//       Expect(attacker.hasDamageDealtRestriction).toBe(true);
//
//       Await testEngine.challenge({
//         Attacker: goofyKnightForADay,
//         Defender: teKaTheBurningOne,
//         ExertDefender: true,
//       });
//
//       Expect(attacker.damage).toBe(0);
//       Expect(defender.zone).toBe("discard");
//     });
//
//     It("As Defender", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [teKaTheBurningOne],
//         },
//         {
//           Play: [balooOlIronPaws, goofyKnightForADay],
//         },
//       );
//
//       Const attacker = testEngine.getCardModel(teKaTheBurningOne);
//       Const defender = testEngine.getCardModel(goofyKnightForADay);
//       Expect(defender.hasDamageDealtRestriction).toBe(true);
//
//       Await testEngine.challenge({
//         Attacker: teKaTheBurningOne,
//         Defender: goofyKnightForADay,
//         ExertDefender: true,
//       });
//
//       Expect(defender.damage).toBe(0);
//       Expect(attacker.zone).toBe("discard");
//     });
//
//     It("Damage from a single target card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: letTheStormRageOn.cost,
//           Hand: [letTheStormRageOn],
//         },
//         {
//           Play: [balooOlIronPaws, goofyKnightForADay],
//         },
//       );
//
//       Const target = testEngine.getCardModel(goofyKnightForADay);
//       Await testEngine.playCard(letTheStormRageOn, {
//         Targets: [goofyKnightForADay],
//       });
//       Expect(target.damage).toBe(0);
//     });
//
//     It("Damage from a multi target cards", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: grabYourSword.cost,
//           Hand: [grabYourSword],
//         },
//         {
//           Play: [balooOlIronPaws, goofyKnightForADay],
//         },
//       );
//
//       Const target = testEngine.getCardModel(goofyKnightForADay);
//       Await testEngine.playCard(grabYourSword);
//       Expect(target.damage).toBe(0);
//     });
//
//     It("Does not prevent 'put' damage effects", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: mosquitoBite.cost,
//           Hand: [mosquitoBite],
//         },
//         {
//           Play: [balooOlIronPaws, goofyKnightForADay],
//         },
//       );
//
//       Const target = testEngine.getCardModel(goofyKnightForADay);
//       Await testEngine.playCard(mosquitoBite, {
//         Targets: [goofyKnightForADay],
//       });
//       Expect(target.damage).toBe(1);
//     });
//
//     It("Does not prevent 'move' damage effects", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: belleAccomplishedMystic.cost,
//           Play: [donaldDuck],
//           Hand: [belleAccomplishedMystic],
//         },
//         {
//           Play: [balooOlIronPaws, goofyKnightForADay],
//         },
//       );
//
//       Await testEngine.setCardDamage(donaldDuck, 2);
//       Await testEngine.playCard(
//         BelleAccomplishedMystic,
//         {
//           Targets: [donaldDuck],
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Targets: [goofyKnightForADay],
//       });
//
//       Expect(testEngine.getCardModel(donaldDuck).damage).toBe(0);
//       Expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(2);
//     });
//   });
// });
//
