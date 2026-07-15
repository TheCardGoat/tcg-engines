// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { scroogeMcduckUncleMoneybags } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Scrooge McDuck - Uncle Moneybags", () => {
//   It.skip("TREASURE FINDER  Whenever this character quests, you pay 1 {I} less for the next item you play this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: scroogeMcduckUncleMoneybags.cost,
//       Play: [scroogeMcduckUncleMoneybags],
//     });
//
//     Const cardUnderTest = testStore.getCard(scroogeMcduckUncleMoneybags);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
