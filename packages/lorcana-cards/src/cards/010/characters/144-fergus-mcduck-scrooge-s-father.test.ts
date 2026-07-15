// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BalooCarefreeBear,
//   FergusMcduckScroogesFather,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Fergus McDuck - Scrooge's Father", () => {
//   It("TOUGHEN UP When you play this character, chosen character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: fergusMcduckScroogesFather.cost,
//       Hand: [fergusMcduckScroogesFather],
//       Play: [balooCarefreeBear],
//     });
//
//     Const target = testEngine.getCardModel(balooCarefreeBear);
//     Expect(target.hasWard).toBe(false);
//
//     Await testEngine.playCard(fergusMcduckScroogesFather);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasWard).toBe(true);
//
//     TestEngine.passTurn();
//
//     Expect(target.hasWard).toBe(true);
//
//     TestEngine.passTurn();
//
//     Expect(target.hasWard).toBe(false);
//   });
// });
//
