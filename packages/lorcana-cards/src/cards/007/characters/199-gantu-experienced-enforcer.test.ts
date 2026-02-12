// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { princeNaveenUkulelePlayer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   GantuExperiencedEnforcer,
//   MickeyMouseInspirationalWarrior,
//   MirabelMadrigalHopefulDreamer,
//   RestoringTheHeart,
//   SpaghettiDinner,
//   TheFamilyMadrigal,
//   TheTroubadourMusicalNarrator,
//   ThunderboltWonderDog,
// } from "@lorcanito/lorcana-engine/cards/007/";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gantu - Experienced Enforcer", () => {
//   It("CLOSE ALL CHANNELS When you play this character, characters can’t exert to sing songs until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 2,
//         Inkwell: gantuExperiencedEnforcer.cost,
//         Play: [theTroubadourMusicalNarrator],
//         Hand: [gantuExperiencedEnforcer],
//       },
//       {
//         Deck: 2,
//         Play: [mirabelMadrigalHopefulDreamer],
//       },
//     );
//
//     Const singer = testEngine.getCardModel(theTroubadourMusicalNarrator);
//     Const anotherSinger = testEngine.getCardModel(
//       MirabelMadrigalHopefulDreamer,
//     );
//
//     Expect(singer.hasSingRestriction).toBe(false);
//     Expect(anotherSinger.hasSingRestriction).toBe(false);
//
//     Await testEngine.playCard(gantuExperiencedEnforcer);
//
//     Expect(singer.hasSingRestriction).toBe(true);
//     Expect(anotherSinger.hasSingRestriction).toBe(true);
//
//     Await testEngine.passTurn();
//
//     Expect(singer.hasSingRestriction).toBe(true);
//     Expect(anotherSinger.hasSingRestriction).toBe(true);
//
//     Await testEngine.passTurn();
//
//     Expect(singer.hasSingRestriction).toBe(false);
//     Expect(anotherSinger.hasSingRestriction).toBe(false);
//   });
//
//   Describe("DON'T GET ANY IDEAS Each player pays 2 {I} more to play actions or items. (This doesn’t apply to singing songs.)", () => {
//     It("[Active Player] Increase cost for items and actions, but not for characters", async () => {
//       Const testEngine = new TestEngine({
//         Play: [gantuExperiencedEnforcer],
//         Hand: [
//           MickeyMouseInspirationalWarrior,
//           SpaghettiDinner,
//           RestoringTheHeart,
//         ],
//       });
//
//       Expect(
//         TestEngine.getCardModel(mickeyMouseInspirationalWarrior).cost,
//       ).toBe(mickeyMouseInspirationalWarrior.cost);
//       Expect(testEngine.getCardModel(spaghettiDinner).cost).toBe(
//         SpaghettiDinner.cost + 2,
//       );
//       Expect(testEngine.getCardModel(restoringTheHeart).cost).toBe(
//         RestoringTheHeart.cost + 2,
//       );
//     });
//
//     It("[Opponent] Increase cost for items and actions, but not for characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Hand: [
//             MickeyMouseInspirationalWarrior,
//             SpaghettiDinner,
//             RestoringTheHeart,
//           ],
//         },
//         {
//           Play: [gantuExperiencedEnforcer],
//         },
//       );
//
//       Expect(
//         TestEngine.getCardModel(mickeyMouseInspirationalWarrior).cost,
//       ).toBe(mickeyMouseInspirationalWarrior.cost);
//       Expect(testEngine.getCardModel(spaghettiDinner).cost).toBe(
//         SpaghettiDinner.cost + 2,
//       );
//       Expect(testEngine.getCardModel(restoringTheHeart).cost).toBe(
//         RestoringTheHeart.cost + 2,
//       );
//     });
//
//     It("Effect Accumulates", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Hand: [
//             MickeyMouseInspirationalWarrior,
//             SpaghettiDinner,
//             RestoringTheHeart,
//           ],
//         },
//         {
//           Play: [gantuExperiencedEnforcer, gantuExperiencedEnforcer],
//         },
//       );
//
//       Expect(
//         TestEngine.getCardModel(mickeyMouseInspirationalWarrior).cost,
//       ).toBe(mickeyMouseInspirationalWarrior.cost);
//       Expect(testEngine.getCardModel(spaghettiDinner).cost).toBe(
//         SpaghettiDinner.cost + 4,
//       );
//       Expect(testEngine.getCardModel(restoringTheHeart).cost).toBe(
//         RestoringTheHeart.cost + 4,
//       );
//     });
//
//     It("This doesn't apply to singing songs.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Hand: [theFamilyMadrigal],
//           Play: [thunderboltWonderDog],
//         },
//         {
//           Play: [gantuExperiencedEnforcer],
//         },
//       );
//
//       Expect(testEngine.getCardModel(theFamilyMadrigal).cost).toBe(
//         TheFamilyMadrigal.cost + 2,
//       );
//
//       Expect(
//         TestEngine
//           .getCardModel(thunderboltWonderDog)
//           .canSingASong(testEngine.getCardModel(theFamilyMadrigal)),
//       ).toBe(true);
//
//       Await testEngine.singSong({
//         Singer: thunderboltWonderDog,
//         Song: theFamilyMadrigal,
//       });
//
//       Expect(testEngine.getCardModel(thunderboltWonderDog).exerted).toEqual(
//         True,
//       );
//       Expect(testEngine.getCardModel(theFamilyMadrigal).zone).toEqual(
//         "discard",
//       );
//     });
//   });
// });
//
// Describe("Regression tests", () => {
//   It("Prince Naveen - Ukulele Player + Gantu - Experienced Enforcer", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: princeNaveenUkulelePlayer.cost,
//         Hand: [princeNaveenUkulelePlayer, aPiratesLife],
//       },
//       {
//         Play: [gantuExperiencedEnforcer],
//       },
//     );
//
//     Await testEngine.playCard(princeNaveenUkulelePlayer);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [aPiratesLife] });
//
//     Expect(testEngine.getCardModel(aPiratesLife).zone).toBe("discard");
//     Expect(testEngine.getCardModel(princeNaveenUkulelePlayer).zone).toBe(
//       "play",
//     );
//   });
// });
//
