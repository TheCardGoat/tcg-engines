// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { vanellopeVonSchweetzCandyMechanic } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   SugarRushSpeedwayFinishLine,
//   TransportPod,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Transport Pod", () => {
//   It("GIVE 'EM A SHOW At the start of your turn, you may move a character of yours to a location for free.", async () => {
//     Const testEngine = new TestEngine(
//       {},
//       {
//         Play: [
//           TransportPod,
//           SugarRushSpeedwayFinishLine,
//           VanellopeVonSchweetzCandyMechanic,
//         ],
//         Deck: 3,
//       },
//     );
//
//     Await testEngine.passTurn();
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [vanellopeVonSchweetzCandyMechanic],
//       },
//       True,
//     );
//     Await testEngine.resolveTopOfStack({
//       Targets: [sugarRushSpeedwayFinishLine],
//     });
//
//     Const character = testEngine.getCardModel(
//       VanellopeVonSchweetzCandyMechanic,
//     );
//     Const location = testEngine.getCardModel(sugarRushSpeedwayFinishLine);
//
//     Expect(location.containsCharacter(character)).toBe(true);
//     Expect(character.isAtLocation(location)).toBe(true);
//   });
// });
//
