// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DormouseEasilyAgitated,
//   MadameMedusaDeceivingPartner,
//   MickeyMouseGiantMouse,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Madame Medusa - Deceiving Partner", () => {
//   It("DOUBLE-CROSS When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player's hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: madameMedusaDeceivingPartner.cost,
//         Hand: [madameMedusaDeceivingPartner],
//         Play: [mickeyMouseGiantMouse],
//       },
//       {
//         Play: [dormouseEasilyAgitated],
//       },
//     );
//
//     Await testEngine.playCard(
//       MadameMedusaDeceivingPartner,
//       {
//         Targets: [mickeyMouseGiantMouse],
//         AcceptOptionalLayer: true,
//       },
//       True,
//     );
//     Await testEngine.resolveTopOfStack({ targets: [dormouseEasilyAgitated] });
//
//     Expect(testEngine.getCardModel(dormouseEasilyAgitated).zone).toBe("hand");
//   });
// });
//
