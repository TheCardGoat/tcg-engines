// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   EmeraldCoil,
//   KashekimAncientRuler,
//   SuzyMasterSeamstress,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Emerald Coil", () => {
//   It("SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 2,
//         Play: [emeraldCoil, kashekimAncientRuler],
//         Hand: [suzyMasterSeamstress],
//       },
//       {
//         Deck: 2,
//       },
//     );
//     Const target = testEngine.getCardModel(kashekimAncientRuler);
//
//     Expect(target.hasEvasive).toBe(false);
//
//     Await testEngine.putIntoInkwell(suzyMasterSeamstress);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });
//
//     Expect(target.hasEvasive).toBe(true);
//
//     Await testEngine.passTurn();
//     Expect(target.hasEvasive).toBe(true);
//
//     Await testEngine.passTurn();
//     Expect(target.hasEvasive).toBe(false);
//   });
// });
//
