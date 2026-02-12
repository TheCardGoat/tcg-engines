// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BaymaxPersonalHealthcareCompanion,
//   GoGoTomagoDartingDynamo,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Go Go Tomago - Darting Dynamo", () => {
//   It("**STOP WHINING, WOMAN UP** When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: goGoTomagoDartingDynamo.cost + 2,
//         Hand: [goGoTomagoDartingDynamo],
//       },
//       {
//         Play: [baymaxPersonalHealthcareCompanion],
//       },
//     );
//
//     Await testEngine.setCardDamage(baymaxPersonalHealthcareCompanion, 3);
//
//     Expect(testEngine.getPlayerLore()).toBe(0);
//
//     Await testEngine.playCard(goGoTomagoDartingDynamo);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [baymaxPersonalHealthcareCompanion],
//     });
//
//     Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//     Expect(testEngine.getPlayerLore("player_one")).toBe(3);
//   });
// });
//
