// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielSpectacularSinger,
//   HeiheiBoatSnack,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   HiroHamadaRoboticsProdigy,
//   HiroHamadaTeamLeader,
//   WasabiMethodicalEngineer,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hiro Hamada - Team Leader", () => {
//   It("**I NEED TO UPGRADE ALL OF YOU** Your other Inventor characters gain **Resist** +1. _(Damage dealt to them is reduced by 1.)_**SHAPE THE FUTURE** 2 {I} − Look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
//     Const testEngine = new TestEngine({
//       Play: [
//         HiroHamadaTeamLeader,
//         HiroHamadaRoboticsProdigy,
//         WasabiMethodicalEngineer,
//       ],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(hiroHamadaTeamLeader);
//     Const hiroHamadaRoboticsProdigyCard = testEngine.getCardModel(
//       HiroHamadaRoboticsProdigy,
//     );
//     Const wasabiMethodicalEngineerCard = testEngine.getCardModel(
//       WasabiMethodicalEngineer,
//     );
//
//     Expect(hiroHamadaRoboticsProdigyCard.hasResist).toBe(true);
//     Expect(wasabiMethodicalEngineerCard.hasResist).toBe(true);
//     Expect(cardUnderTest.hasResist).toBe(false);
//   });
//
//   It("**SHAPE THE FUTURE** 2 {I} − Look at the top card of your deck. Put it on either the top or the bottom of your deck.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 2,
//         Play: [hiroHamadaTeamLeader],
//         Deck: [heiheiBoatSnack, friendsOnTheOtherSide, arielSpectacularSinger],
//       },
//       {
//         Deck: 2,
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(hiroHamadaTeamLeader);
//     Const first = testEngine.getCardModel(arielSpectacularSinger);
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "SHAPE THE FUTURE",
//     });
//
//     Await testEngine.resolveTopOfStack({ scry: { top: [first] } });
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Expect(first.zone).toBe("hand");
//   });
// });
//
