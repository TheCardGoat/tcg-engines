// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MickeyMouseDetective,
//   PromisingLead,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Promising Lead", () => {
//   It("gives chosen character +2 lore this turn when target is not a Detective", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: promisingLead.cost,
//       Play: [mickeyBraveLittleTailor],
//       Hand: [promisingLead],
//     });
//
//     Const targetCharacter = testEngine.getCardModel(mickeyBraveLittleTailor);
//     Const baseLore = targetCharacter.lore;
//
//     Await testEngine.playCard(promisingLead);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });
//
//     Expect(targetCharacter.lore).toBe(baseLore + 2);
//     Expect(targetCharacter.hasSupport).toBe(false);
//   });
//
//   It("gives chosen Detective character +2 lore AND Support this turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: promisingLead.cost,
//         Play: [mickeyMouseDetective],
//         Hand: [promisingLead],
//       },
//       {},
//     );
//
//     Const targetCharacter = testEngine.getCardModel(mickeyMouseDetective);
//     Const baseLore = targetCharacter.lore;
//
//     Await testEngine.playCard(promisingLead);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyMouseDetective] });
//
//     Expect(targetCharacter.lore).toBe(baseLore + 2);
//     Expect(targetCharacter.hasSupport).toBe(true);
//   });
// });
//
