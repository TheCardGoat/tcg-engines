// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   balooCarefreeBear,
//   fergusMcduckScroogesFather,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Fergus McDuck - Scrooge's Father", () => {
//   it("TOUGHEN UP When you play this character, chosen character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: fergusMcduckScroogesFather.cost,
//       hand: [fergusMcduckScroogesFather],
//       play: [balooCarefreeBear],
//     });
//
//     const target = testEngine.getCardModel(balooCarefreeBear);
//     expect(target.hasWard).toBe(false);
//
//     await testEngine.playCard(fergusMcduckScroogesFather);
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     expect(target.hasWard).toBe(true);
//
//     testEngine.passTurn();
//
//     expect(target.hasWard).toBe(true);
//
//     testEngine.passTurn();
//
//     expect(target.hasWard).toBe(false);
//   });
// });
//
