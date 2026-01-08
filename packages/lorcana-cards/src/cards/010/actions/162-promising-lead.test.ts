// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   mickeyMouseDetective,
//   promisingLead,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Promising Lead", () => {
//   it("gives chosen character +2 lore this turn when target is not a Detective", async () => {
//     const testEngine = new TestEngine({
//       inkwell: promisingLead.cost,
//       play: [mickeyBraveLittleTailor],
//       hand: [promisingLead],
//     });
//
//     const targetCharacter = testEngine.getCardModel(mickeyBraveLittleTailor);
//     const baseLore = targetCharacter.lore;
//
//     await testEngine.playCard(promisingLead);
//     await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });
//
//     expect(targetCharacter.lore).toBe(baseLore + 2);
//     expect(targetCharacter.hasSupport).toBe(false);
//   });
//
//   it("gives chosen Detective character +2 lore AND Support this turn", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: promisingLead.cost,
//         play: [mickeyMouseDetective],
//         hand: [promisingLead],
//       },
//       {},
//     );
//
//     const targetCharacter = testEngine.getCardModel(mickeyMouseDetective);
//     const baseLore = targetCharacter.lore;
//
//     await testEngine.playCard(promisingLead);
//     await testEngine.resolveTopOfStack({ targets: [mickeyMouseDetective] });
//
//     expect(targetCharacter.lore).toBe(baseLore + 2);
//     expect(targetCharacter.hasSupport).toBe(true);
//   });
// });
//
