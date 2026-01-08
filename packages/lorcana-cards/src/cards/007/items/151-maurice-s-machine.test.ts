// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { mauricesMachine, rubyCoil } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Maurice's Machine", () => {
//   it("BREAK DOWN When this item is banished, you may return an item card with cost 2 or less from your discard to your hand.", async () => {
//     const testEngine = new TestEngine({
//       deck: 4,
//       play: [mauricesMachine, hiramFlavershamToymaker],
//       discard: [rubyCoil],
//     });
//
//     await testEngine.questCard(hiramFlavershamToymaker);
//     await testEngine.acceptOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [mauricesMachine] }, true);
//
//     await testEngine.acceptOptionalAbility();
//     await testEngine.resolveTopOfStack({
//       targets: [rubyCoil],
//     });
//
//     expect(testEngine.getCardModel(rubyCoil).zone).toBe("hand");
//     expect(testEngine.getCardModel(mauricesMachine).zone).toBe("discard");
//   });
// });
//
