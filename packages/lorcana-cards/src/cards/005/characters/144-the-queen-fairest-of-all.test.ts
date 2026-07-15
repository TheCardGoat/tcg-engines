// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   TheQueenCrownOfTheCouncil,
//   TheQueenCruelestOfAll,
//   TheQueenFairestOfAll,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Queen - Fairest of All", () => {
//   It("**REFLECTIONS OF VANITY** For each other character named The Queen you have in play, this character gets +1 {L}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: theQueenFairestOfAll.cost,
//       Play: [
//         TheQueenFairestOfAll,
//         TheQueenCrownOfTheCouncil,
//         TheQueenCruelestOfAll,
//       ],
//     });
//
//     Expect(testStore.getCard(theQueenFairestOfAll).lore).toEqual(
//       TheQueenFairestOfAll.lore + 2,
//     );
//   });
// });
//
