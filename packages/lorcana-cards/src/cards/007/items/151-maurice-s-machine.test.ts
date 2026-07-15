// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mauricesMachine, rubyCoil } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Maurice's Machine", () => {
//   It("BREAK DOWN When this item is banished, you may return an item card with cost 2 or less from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Deck: 4,
//       Play: [mauricesMachine, hiramFlavershamToymaker],
//       Discard: [rubyCoil],
//     });
//
//     Await testEngine.questCard(hiramFlavershamToymaker);
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [mauricesMachine] }, true);
//
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [rubyCoil],
//     });
//
//     Expect(testEngine.getCardModel(rubyCoil).zone).toBe("hand");
//     Expect(testEngine.getCardModel(mauricesMachine).zone).toBe("discard");
//   });
// });
//
