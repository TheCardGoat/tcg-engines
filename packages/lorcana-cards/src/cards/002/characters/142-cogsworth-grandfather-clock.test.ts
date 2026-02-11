// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MegaraPullingTheStrings,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   CogsworthGrandfatherClock,
//   EliLaBouffBigDaddy,
//   GoofyKnightForADay,
//   MadamMimFox,
//   OwlLogicalLecturer,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cogsworth - Grandfather Clock", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [cogsworthGrandfatherClock],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CogsworthGrandfatherClock.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toBeTruthy();
//   });
//
//   It("Ward", () => {
//     Const testStore = new TestStore({
//       Play: [cogsworthGrandfatherClock],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CogsworthGrandfatherClock.id,
//     );
//
//     Expect(cardUnderTest.hasWard).toBeTruthy();
//   });
//
//   Describe("**UNWIND** Your other characters gain **Resist** +1 _(Damage dealt to them is reduced by 1.)_", () => {
//     It("Other characters gain Resist", () => {
//       Const testStore = new TestStore({
//         Play: [
//           MegaraPullingTheStrings,
//           MickeyMouseTrueFriend,
//           CogsworthGrandfatherClock,
//         ],
//       });
//
//       Const target = testStore.getByZoneAndId(
//         "play",
//         MegaraPullingTheStrings.id,
//       );
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//       );
//
//       Expect(target.hasResist).toEqual(true);
//       Expect(anotherTarget.hasResist).toEqual(true);
//     });
//
//     It("Multiple Cogsworth should stack resist", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [
//             MegaraPullingTheStrings,
//             MickeyMouseTrueFriend,
//             CogsworthGrandfatherClock,
//             CogsworthGrandfatherClock,
//           ],
//         },
//         {
//           Play: [madamMimFox, mickeyMouseTrueFriend],
//         },
//       );
//
//       Const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);
//
//       Const cogs = testStore.getByZoneAndId(
//         "play",
//         CogsworthGrandfatherClock.id,
//       );
//
//       Target.updateCardMeta({ exerted: true });
//       Cogs.updateCardMeta({ exerted: true });
//
//       Const opponentMim = testStore.getByZoneAndId(
//         "play",
//         MadamMimFox.id,
//         "player_two",
//       );
//       Const opponentMicky = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//
//       Expect(target.hasResist).toEqual(true);
//       // Check that Mickey is at resist 2, fox has 4 attack so it should be reduced to 2
//       OpponentMim.challenge(target);
//       Expect(target.damage).toEqual(2);
//
//       Expect(cogs.hasResist).toEqual(true);
//       // Check that cogsworth is only at resist 1, mickey has 3 attack so it should be reduced to 2
//       OpponentMicky.challenge(cogs);
//       Expect(cogs.damage).toEqual(2);
//     });
//
//     It("Cogsworth himself doesn't have resist", () => {
//       Const testStore = new TestStore({
//         Play: [cogsworthGrandfatherClock],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         CogsworthGrandfatherClock.id,
//       );
//
//       Expect(cardUnderTest.hasResist).toEqual(false);
//     });
//
//     It("Two Cogsworths give resist to one another", () => {
//       Const testStore = new TestStore({
//         Play: [cogsworthGrandfatherClock, cogsworthGrandfatherClock],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         CogsworthGrandfatherClock.id,
//       );
//
//       Expect(cardUnderTest.hasResist).toEqual(true);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("should not be targeted by Let the Storm Rage On", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: letTheStormRageOn.cost,
//         Hand: [letTheStormRageOn],
//         Deck: 2,
//       },
//       { play: [cogsworthGrandfatherClock, goofyKnightForADay] },
//     );
//
//     Const cardUnderTest = testStore.getCard(letTheStormRageOn);
//     Const target = testStore.getCard(cogsworthGrandfatherClock);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] }, true);
//
//     Expect(target.meta.damage).toBeFalsy();
//   });
//
//   It("Resist not working", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [eliLaBouffBigDaddy],
//       },
//       { play: [cogsworthGrandfatherClock, owlLogicalLecturer] },
//     );
//
//     Const attacker = testStore.getCard(eliLaBouffBigDaddy);
//     Const defender = testStore.getCard(owlLogicalLecturer);
//
//     Expect(defender.hasResist).toEqual(true);
//     Defender.updateCardMeta({ exerted: true });
//
//     Attacker.challenge(defender);
//
//     Expect(defender.meta.damage).toEqual(1);
//     Expect(attacker.meta.damage).toEqual(2);
//   });
//
//   It("Resist not working", () => {
//     Const testStore = new TestStore(
//       { play: [cogsworthGrandfatherClock, owlLogicalLecturer] },
//       {
//         Play: [eliLaBouffBigDaddy],
//       },
//     );
//
//     Const attacker = testStore.getCard(owlLogicalLecturer);
//     Const defender = testStore.getCard(eliLaBouffBigDaddy);
//
//     Expect(attacker.hasResist).toEqual(true);
//     Defender.updateCardMeta({ exerted: true });
//
//     Attacker.challenge(defender);
//
//     Expect(defender.meta.damage).toEqual(2);
//     Expect(attacker.meta.damage).toEqual(1);
//   });
// });
//
