// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { vanellopeVonSchweetzRandomRosterRacer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Vanellope von Schweetz - Random Roster Racer", () => {
//   It("**PIXLEXIA** When you play this character, she gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: vanellopeVonSchweetzRandomRosterRacer.cost,
//       Hand: [vanellopeVonSchweetzRandomRosterRacer],
//     });
//
//     Const cardUnderTest = testStore.getCard(
//       VanellopeVonSchweetzRandomRosterRacer,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({});
//
//     Expect(cardUnderTest.hasEvasive).toEqual(true);
//
//     TestStore.passTurn();
//
//     Expect(cardUnderTest.hasEvasive).toEqual(true);
//
//     TestStore.passTurn();
//
//     Expect(cardUnderTest.hasEvasive).toEqual(false);
//   });
// });
//
