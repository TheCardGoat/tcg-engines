// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { rafikiShamanDuelist } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rafiki - Shaman Duelist", () => {
//   It("**SURPRISING SKILL** When you play this character, he gains **Challenger** +4 this turn. _(They get +4 while challenging.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: rafikiShamanDuelist.cost,
//       Hand: [rafikiShamanDuelist],
//     });
//
//     Const cardUnderTest = testStore.getCard(rafikiShamanDuelist);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({});
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
